from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Body
from sqlalchemy.orm import Session
from typing import List, Optional
import json
import os
import pickle
import uuid
import shutil

from app.db.database import get_db
from app.models import (User, StudentProfile, Question, Assessment, AssessmentAnswer,
                        AssessmentAnswerSelection, Resource, Recommendation, RecommendationFeedback,
                        JournalEntry)
from app.schemas import (StudentProfile as StudentProfileSchema, StudentProfileCreate,
                         Question as QuestionSchema, Resource as ResourceSchema,
                         AssessmentSubmit, AssessmentResult, RecommendationResponse,
                         RecommendationFeedbackSubmit)
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/api", tags=["student"])

# --- Load ML model (absolute path resolution) ---
_base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
_model_path = os.path.join(_base_dir, '..', 'ml', 'artifacts', 'model.pkl')
ml_pipeline = None
try:
    with open(_model_path, 'rb') as f:
        ml_pipeline = pickle.load(f)
    print(f"ML model loaded successfully from {_model_path}")
except Exception as e:
    print(f"Warning: ML model not found ({e}). Using rule-based fallback.")

def rule_based_predict(answers_dict: dict) -> str:
    """Fallback rule-based stress predictor when ML model is unavailable."""
    try:
        score = 0
        # Q3–Q9 are numeric Likert 1-5 stress indicators
        stress_keys = ["Q3", "Q4", "Q6", "Q7", "Q8", "Q9"]
        vals = [int(answers_dict.get(k, 3)) for k in stress_keys]
        avg = sum(vals) / len(vals)
        # Q5 sleep hours penalty
        sleep = answers_dict.get("Q5", "7–8")
        sleep_penalty = 1 if sleep in ["Less than 5", "5–6"] else 0
        score = avg + sleep_penalty
        if score <= 2.5:
            return "Low"
        elif score <= 4.0:
            return "Moderate"
        else:
            return "High"
    except Exception:
        return "Moderate"


# --- Profile ---
@router.get("/profile", response_model=StudentProfileSchema)
def read_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        # Auto-create empty profile
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("/profile", response_model=StudentProfileSchema)
def update_profile(profile_update: StudentProfileCreate, db: Session = Depends(get_db),
                   current_user: User = Depends(get_current_user)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
    for key, value in profile_update.model_dump(exclude_unset=True).items():
        setattr(profile, key, value)
    db.commit()
    db.refresh(profile)
    return profile

# --- Profile Picture Upload ---
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads")

@router.post("/profile/upload-photo")
def upload_profile_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validate file type
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' not allowed. Use: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Validate file size (max 5MB)
    contents = file.file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB.")
    file.file.seek(0)

    # Generate unique filename
    unique_name = f"avatar_{current_user.id}_{uuid.uuid4().hex[:8]}{ext}"
    save_path = os.path.join(UPLOADS_DIR, unique_name)

    # Save the file
    os.makedirs(UPLOADS_DIR, exist_ok=True)
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Update profile with the new URL
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)

    # Store as a URL path the frontend can use
    profile.profile_pic_url = f"http://localhost:8001/uploads/{unique_name}"
    db.commit()
    db.refresh(profile)

    return {"url": profile.profile_pic_url, "filename": unique_name}

# --- Questions ---
@router.get("/questions", response_model=List[QuestionSchema])
def get_active_questions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Question).filter(Question.active == True).order_by(Question.order_no).all()

# --- Resources ---
@router.get("/resources", response_model=List[ResourceSchema])
def search_resources(q: Optional[str] = None, db: Session = Depends(get_db),
                     current_user: User = Depends(get_current_user)):
    query = db.query(Resource).filter(Resource.active == True)
    if q:
        query = query.filter(Resource.title.contains(q) | Resource.tags_json.contains(q))
    return query.all()

# --- Assessment History ---
@router.get("/assessments/history")
def get_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    assessments = (db.query(Assessment)
                   .filter(Assessment.user_id == current_user.id)
                   .order_by(Assessment.submitted_at.desc())
                   .all())
                   
    history_data = []
    for a in assessments:
        # Compute score_percentage dynamically based on actual answers
        answers = db.query(AssessmentAnswer).filter(AssessmentAnswer.assessment_id == a.id).all()
        answers_dict = {f"Q{ans.question_id}": ans.answer_value for ans in answers if ans.answer_value is not None}
        
        stress_keys = ["Q3", "Q4", "Q6", "Q7", "Q8", "Q9"]
        vals = []
        for k in stress_keys:
            try:
                vals.append(int(answers_dict.get(k, 3)))
            except:
                vals.append(3)
                
        avg = sum(vals) / len(vals) if vals else 3
        
        sleep = answers_dict.get("Q5", "7–8")
        sleep_penalty = 1 if sleep in ["Less than 5", "5–6"] else 0
        score = avg + sleep_penalty
        
        # Map score (1 to 6) to mental wellness percentage (100% to 0%)
        percentage = max(0, min(100, int(100 - ((score - 1) / 5.0) * 100)))
        
        mood = answers_dict.get("Q15", "Tired but okay")
        
        # Compute individual mood aspects (each 0-100, higher = better wellness)
        def q_to_wellness(key, invert=True):
            """Convert a 1-5 Likert answer to a 0-100 wellness score.
            If invert=True, 1 (low stress) -> 100, 5 (high stress) -> 0.
            If invert=False, 1 -> 0, 5 -> 100 (for satisfaction-type questions).
            """
            try:
                v = int(answers_dict.get(key, 3))
            except:
                v = 3
            if invert:
                return max(0, min(100, int((5 - v) / 4 * 100)))
            else:
                return max(0, min(100, int((v - 1) / 4 * 100)))
        
        # Sleep score
        sleep_map = {"More than 8": 100, "7–8": 90, "5–6": 40, "Less than 5": 10}
        sleep_score = sleep_map.get(sleep, 50)
        
        mood_aspects = {
            "Calmness": q_to_wellness("Q3"),        # inverse of academic workload stress
            "Emotional": q_to_wellness("Q4"),        # inverse of anxiety/overwhelm
            "Sleep": sleep_score,                    # sleep quality
            "Energy": q_to_wellness("Q6"),           # inverse of mental exhaustion
            "Focus": q_to_wellness("Q7"),            # inverse of concentration difficulty
        }
        
        history_data.append({
            "id": a.id, 
            "date": a.submitted_at, 
            "level": a.predicted_level,
            "score_percentage": percentage,
            "mood": mood,
            "mood_aspects": mood_aspects
        })
        
    return history_data

# --- Latest Recommendations ---
@router.get("/recommendations/latest", response_model=List[RecommendationResponse])
def get_latest_recommendations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    latest = (db.query(Assessment)
              .filter(Assessment.user_id == current_user.id)
              .order_by(Assessment.submitted_at.desc())
              .first())
    if not latest:
        return []
    return (db.query(Recommendation)
            .filter(Recommendation.assessment_id == latest.id)
            .order_by(Recommendation.rank)
            .all())

# --- Submit Assessment ---
@router.post("/assessments", response_model=AssessmentResult)
def submit_assessment(assessment_data: AssessmentSubmit, db: Session = Depends(get_db),
                      current_user: User = Depends(get_current_user)):
    # 1. Save Assessment record
    db_assessment = Assessment(user_id=current_user.id, model_version="1.0.0")
    db.add(db_assessment)
    db.commit()
    db.refresh(db_assessment)

    # 2. Save Answers and build answers_dict for prediction
    answers_dict = {}
    for ans in assessment_data.answers:
        if ans.answer_value is not None:
            db_ans = AssessmentAnswer(
                assessment_id=db_assessment.id,
                question_id=ans.question_id,
                answer_value=ans.answer_value
            )
            db.add(db_ans)
            answers_dict[f"Q{ans.question_id}"] = ans.answer_value
        if ans.option_values:
            for opt in ans.option_values:
                db_sel = AssessmentAnswerSelection(
                    assessment_id=db_assessment.id,
                    question_id=ans.question_id,
                    option_value=opt
                )
                db.add(db_sel)
    db.commit()

    # 3. Predict stress level
    if ml_pipeline is not None:
        try:
            import pandas as pd
            input_data = {
                "Q3": [int(answers_dict.get("Q3", 3))],
                "Q4": [int(answers_dict.get("Q4", 3))],
                "Q6": [int(answers_dict.get("Q6", 3))],
                "Q7": [int(answers_dict.get("Q7", 3))],
                "Q8": [int(answers_dict.get("Q8", 3))],
                "Q9": [int(answers_dict.get("Q9", 3))],
                "Q5": [answers_dict.get("Q5", "7–8")]
            }
            df = pd.DataFrame(input_data)
            prediction = ml_pipeline.predict(df)[0]
        except Exception as e:
            prediction = rule_based_predict(answers_dict)
    else:
        prediction = rule_based_predict(answers_dict)

    db_assessment.predicted_level = prediction
    db.commit()

    # 4. Generate Recommendations
    resources = db.query(Resource).filter(Resource.active == True).all()
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    avail_time = profile.available_time if profile and profile.available_time else "10–20 min"

    # Stress-to-category mapping
    stress_category_map = {
        "High": ["meditation", "exercise", "breathing"],
        "Moderate": ["exercise", "audio", "article"],
        "Low": ["video", "article", "animation"],
    }
    preferred_cats = stress_category_map.get(prediction, [])

    scored_resources = []
    for r in resources:
        score = 0.0
        # Stress fit
        cat_match = 1.0 if (r.category or "").lower() in preferred_cats else 0.3
        score += 0.45 * cat_match
        # Time fit
        try:
            dur_str = avail_time.split("–")[0].replace(" min", "").strip()
            avail_min = int(dur_str)
            time_fit = 1.0 if r.duration_min and r.duration_min <= avail_min else 0.5
        except Exception:
            time_fit = 0.5
        score += 0.15 * time_fit
        # Preference match (neutral for now)
        score += 0.30 * 0.5
        # Diversity bonus
        score += 0.10 * 0.5
        scored_resources.append((r, min(1.0, score)))

    scored_resources.sort(key=lambda x: x[1], reverse=True)
    top_resources = scored_resources[:5]

    for rank, (res, score) in enumerate(top_resources, 1):
        rec = Recommendation(
            assessment_id=db_assessment.id,
            resource_id=res.id,
            rank=rank,
            score=round(score, 3),
            reason=f"Matched for {prediction} stress level"
        )
        db.add(rec)
    db.commit()

    return db_assessment

# --- Recommendation Feedback ---
@router.post("/recommendations/{rec_id}/feedback")
def submit_feedback(rec_id: int, feedback: RecommendationFeedbackSubmit,
                    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rec = db.query(Recommendation).filter(Recommendation.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    assessment = db.query(Assessment).filter(Assessment.id == rec.assessment_id).first()
    if assessment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    existing = db.query(RecommendationFeedback).filter(
        RecommendationFeedback.recommendation_id == rec_id
    ).first()
    if existing:
        existing.rating = feedback.rating
    else:
        db.add(RecommendationFeedback(
            recommendation_id=rec_id,
            user_id=current_user.id,
            rating=feedback.rating
        ))
    db.commit()
    return {"status": "success"}

# --- Journal ---
@router.get("/journal")
def get_journal_entries(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entries = (db.query(JournalEntry)
               .filter(JournalEntry.user_id == current_user.id)
               .order_by(JournalEntry.updated_at.desc())
               .all())
    return [{"id": e.id, "title": e.title, "content": e.content, "mood_tag": e.mood_tag,
             "created_at": e.created_at, "updated_at": e.updated_at} for e in entries]

@router.post("/journal")
def create_journal_entry(data: dict = Body(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entry = JournalEntry(
        user_id=current_user.id,
        title=data.get("title", "Untitled"),
        content=data.get("content", ""),
        mood_tag=data.get("mood_tag")
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return {"id": entry.id, "title": entry.title, "content": entry.content, "mood_tag": entry.mood_tag,
            "created_at": entry.created_at, "updated_at": entry.updated_at}

@router.put("/journal/{entry_id}")
def update_journal_entry(entry_id: int, data: dict = Body(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id, JournalEntry.user_id == current_user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    if "title" in data:
        entry.title = data["title"]
    if "content" in data:
        entry.content = data["content"]
    if "mood_tag" in data:
        entry.mood_tag = data["mood_tag"]
    db.commit()
    db.refresh(entry)
    return {"id": entry.id, "title": entry.title, "content": entry.content, "mood_tag": entry.mood_tag,
            "created_at": entry.created_at, "updated_at": entry.updated_at}

@router.delete("/journal/{entry_id}")
def delete_journal_entry(entry_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id, JournalEntry.user_id == current_user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    db.delete(entry)
    db.commit()
    return {"status": "deleted"}
