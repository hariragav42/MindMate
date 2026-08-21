import json
from app.db.database import SessionLocal, engine, Base
from app.models import Question, Resource

# Ensure tables are created
Base.metadata.create_all(bind=engine)

db = SessionLocal()

def seed_questions():
    if db.query(Question).count() > 0:
        print("Questions already seeded.")
        return

    questions_data = [
        {"id": 1, "text": "Year of study", "type": "single", "options": ["1st", "2nd", "3rd", "4th"]},
        {"id": 2, "text": "Study hours outside college/day", "type": "single", "options": ["<1", "1–2", "2–4", ">4"]},
        {"id": 3, "text": "Academic workload/assignments/exams stress you", "type": "single", "options": ["1", "2", "3", "4", "5"]},
        {"id": 4, "text": "Worry about grades/career/future", "type": "single", "options": ["1", "2", "3", "4", "5"]},
        {"id": 5, "text": "Sleep per night", "type": "single", "options": ["<5", "5–6", "6–7", "7–8", ">8"]},
        {"id": 6, "text": "Daytime tiredness/mental exhaustion", "type": "single", "options": ["1", "2", "3", "4", "5"]},
        {"id": 7, "text": "Difficulty concentrating", "type": "single", "options": ["1", "2", "3", "4", "5"]},
        {"id": 8, "text": "Anxious/worried or unable to relax", "type": "single", "options": ["1", "2", "3", "4", "5"]},
        {"id": 9, "text": "Unable to manage responsibilities", "type": "single", "options": ["1", "2", "3", "4", "5"]},
        {"id": 10, "text": "What helps you relax?", "type": "multi", "options": ["music", "meditation", "yoga", "walking/exercise", "nature", "reading", "gaming", "friends/family", "comedy", "cute animals", "videos"]},
        {"id": 11, "text": "What should the app show when stressed?", "type": "multi", "options": ["music", "meditation", "yoga", "walking/exercise", "nature", "comedy", "cute animals"]},
        {"id": 12, "text": "Available relaxation time", "type": "single", "options": ["2–5 min", "5–10 min", "10–20 min", "20–30 min", ">30 min"]},
        {"id": 13, "text": "Self-rated current stress", "type": "single", "options": ["Low", "Moderate", "High"]},
        {"id": 14, "text": "Seek support when stressed?", "type": "single", "options": ["Always", "Often", "Sometimes", "Rarely", "Never"]},
        {"id": 15, "text": "Preferred app support", "type": "single", "options": ["Relaxation", "content", "counselor info", "tracking", "chatbot-style", "combination"]},
    ]

    for q in questions_data:
        db_question = Question(
            id=q["id"],
            text=q["text"],
            type=q["type"],
            options_json=json.dumps(q["options"]),
            order_no=q["id"]
        )
        db.add(db_question)
    
    db.commit()
    print("Questions seeded successfully.")

def seed_resources():
    if db.query(Resource).count() > 0:
        print("Resources already seeded.")
        return

    resources_data = [
        {"title": "Deep Breathing Exercise", "category": "meditation", "tags_json": '["meditation", "breathing"]', "duration_min": 3, "content_type": "exercise", "content_url": None, "content_text": "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds."},
        {"title": "Nature Walk Visuals", "category": "nature", "tags_json": '["nature", "videos"]', "duration_min": 5, "content_type": "video", "content_url": "https://www.youtube.com/watch?v=1", "content_text": None},
        {"title": "Cute Cat Compilation", "category": "cute animals", "tags_json": '["cute animals", "comedy"]', "duration_min": 10, "content_type": "video", "content_url": "https://www.youtube.com/watch?v=2", "content_text": None},
        {"title": "Lofi Study Music", "category": "music", "tags_json": '["music"]', "duration_min": 30, "content_type": "audio", "content_url": "https://www.youtube.com/watch?v=3", "content_text": None},
        {"title": "Quick Desk Yoga", "category": "yoga", "tags_json": '["yoga", "walking/exercise"]', "duration_min": 5, "content_type": "exercise", "content_url": "https://www.youtube.com/watch?v=4", "content_text": "Simple stretches to do at your desk."},
    ]

    for r in resources_data:
        db_resource = Resource(**r)
        db.add(db_resource)
        
    db.commit()
    print("Resources seeded successfully.")

if __name__ == "__main__":
    seed_questions()
    seed_resources()
    print("Seeding complete.")
