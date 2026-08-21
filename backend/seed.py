"""
Seed script - run once to populate questions and resources.
Run from backend/ dir: venv\\Scripts\\python.exe seed.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.database import SessionLocal, engine, Base
from app.models import Question, Resource
import json

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Clear existing data
db.query(Question).delete()
db.query(Resource).delete()
db.commit()

questions = [
    {"order_no": 1,  "text": "What is your current year of study?", "type": "single",
     "options_json": json.dumps(["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate"])},
    {"order_no": 2,  "text": "How many hours do you study per day on average?", "type": "single",
     "options_json": json.dumps(["Less than 2 hours", "2–4 hours", "4–6 hours", "More than 6 hours"])},
    {"order_no": 3,  "text": "How stressed do you feel about your academic workload? (1=Not at all, 5=Extremely)", "type": "single",
     "options_json": json.dumps(["1", "2", "3", "4", "5"])},
    {"order_no": 4,  "text": "How often do you feel anxious or overwhelmed? (1=Never, 5=Always)", "type": "single",
     "options_json": json.dumps(["1", "2", "3", "4", "5"])},
    {"order_no": 5,  "text": "How many hours of sleep do you get per night on average?", "type": "single",
     "options_json": json.dumps(["Less than 5", "5–6", "7–8", "More than 8"])},
    {"order_no": 6,  "text": "How often do you feel mentally exhausted after a day of studying? (1=Never, 5=Always)", "type": "single",
     "options_json": json.dumps(["1", "2", "3", "4", "5"])},
    {"order_no": 7,  "text": "How difficult is it for you to concentrate on your studies? (1=Very easy, 5=Very difficult)", "type": "single",
     "options_json": json.dumps(["1", "2", "3", "4", "5"])},
    {"order_no": 8,  "text": "How often do you experience physical symptoms of stress (headaches, tension)? (1=Never, 5=Always)", "type": "single",
     "options_json": json.dumps(["1", "2", "3", "4", "5"])},
    {"order_no": 9,  "text": "How satisfied are you with your academic performance? (1=Very unsatisfied, 5=Very satisfied)", "type": "single",
     "options_json": json.dumps(["1", "2", "3", "4", "5"])},
    {"order_no": 10, "text": "What types of relaxation activities do you prefer? (Select all that apply)", "type": "multi",
     "options_json": json.dumps(["Meditation/Mindfulness", "Physical Exercise", "Music/Audio", "Breathing Exercises",
                                  "Reading/Articles", "Videos/Animations", "Nature Walks"])},
    {"order_no": 11, "text": "What kind of academic support do you find most helpful? (Select all that apply)", "type": "multi",
     "options_json": json.dumps(["Study tips and techniques", "Time management strategies", "Stress management techniques",
                                  "Peer support groups", "Professional counselling"])},
    {"order_no": 12, "text": "How much time can you dedicate to a relaxation activity right now?", "type": "single",
     "options_json": json.dumps(["2–5 min", "5–10 min", "10–20 min", "20–30 min", "More than 30 min"])},
    {"order_no": 13, "text": "How often do you take breaks while studying?", "type": "single",
     "options_json": json.dumps(["Never", "Rarely", "Sometimes", "Often", "Very often"])},
    {"order_no": 14, "text": "Do you have a regular exercise or physical activity routine?", "type": "single",
     "options_json": json.dumps(["Yes, daily", "3–4 times a week", "Occasionally", "Rarely", "Never"])},
    {"order_no": 15, "text": "How would you describe your current mood?", "type": "single",
     "options_json": json.dumps(["Happy and motivated", "Calm", "Tired but okay", "Stressed", "Overwhelmed"])},
]

for q in questions:
    db.add(Question(**q, active=True))

resources = [
    {"title": "4-7-8 Breathing Technique", "category": "breathing", "tags_json": json.dumps(["breathing", "anxiety", "quick"]),
     "duration_min": 5, "content_type": "exercise",
     "content_text": "Inhale for 4 counts, hold for 7 counts, exhale for 8 counts. Repeat 4 times. This activates the parasympathetic nervous system to quickly calm anxiety.", "active": True},
    {"title": "Progressive Muscle Relaxation", "category": "exercise", "tags_json": json.dumps(["relaxation", "tension", "body"]),
     "duration_min": 15, "content_type": "exercise",
     "content_text": "Starting from your toes and working up, tense each muscle group for 5 seconds then release for 30 seconds. Focus on the feeling of relaxation.", "active": True},
    {"title": "Guided Body Scan Meditation", "category": "meditation", "tags_json": json.dumps(["meditation", "mindfulness", "stress"]),
     "duration_min": 10, "content_type": "audio",
     "content_url": "https://www.youtube.com/watch?v=QS2yDmWk0vs", "active": True},
    {"title": "Study Break Stretches", "category": "exercise", "tags_json": json.dumps(["exercise", "stretching", "posture"]),
     "duration_min": 5, "content_type": "exercise",
     "content_text": "1. Neck rolls (30s each side)\n2. Shoulder shrugs (10 reps)\n3. Seated spinal twist (30s each side)\n4. Wrist circles (10s each direction)\n5. Standing forward fold (30s)", "active": True},
    {"title": "Pomodoro Technique Guide", "category": "article", "tags_json": json.dumps(["productivity", "study", "time-management"]),
     "duration_min": 7, "content_type": "article",
     "content_text": "Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 15–30 minute break. This scientifically-proven method reduces mental fatigue and improves focus.", "active": True},
    {"title": "5-Minute Mindfulness Meditation", "category": "meditation", "tags_json": json.dumps(["mindfulness", "quick", "focus"]),
     "duration_min": 5, "content_type": "exercise",
     "content_text": "Find a comfortable position. Close your eyes. Breathe naturally. Focus your attention on the sensation of your breath. When your mind wanders, gently bring it back. No judgement.", "active": True},
    {"title": "Calm Nature Sounds - Forest Rain", "category": "audio", "tags_json": json.dumps(["audio", "nature", "sleep"]),
     "duration_min": 20, "content_type": "audio",
     "content_url": "https://www.youtube.com/watch?v=q76bMs-NwRk", "active": True},
    {"title": "Cute Animals Taking Breaks", "category": "animation", "tags_json": json.dumps(["cute", "mood-booster", "fun"]),
     "duration_min": 3, "content_type": "video",
     "content_url": "https://www.youtube.com/watch?v=0Bmhjf0rKe8", "active": True},
    {"title": "Box Breathing for Stress", "category": "breathing", "tags_json": json.dumps(["breathing", "stress", "quick"]),
     "duration_min": 3, "content_type": "exercise",
     "content_text": "Inhale for 4 counts → Hold for 4 counts → Exhale for 4 counts → Hold for 4 counts. Repeat 4-6 times. Used by Navy SEALs for rapid stress control.", "active": True},
    {"title": "Desk Yoga for Students", "category": "exercise", "tags_json": json.dumps(["yoga", "desk", "posture", "back-pain"]),
     "duration_min": 10, "content_type": "video",
     "content_url": "https://www.youtube.com/watch?v=tAUf7aajBWE", "active": True},
    {"title": "How to Deal With Exam Anxiety", "category": "article", "tags_json": json.dumps(["anxiety", "exam", "tips"]),
     "duration_min": 8, "content_type": "article",
     "content_text": "1. Prepare adequately — create a study schedule.\n2. Practice relaxation techniques daily.\n3. Challenge negative thoughts.\n4. Focus on what you can control.\n5. Get adequate sleep before the exam.\n6. Use positive self-talk.", "active": True},
    {"title": "Lofi Hip Hop Study Beats", "category": "audio", "tags_json": json.dumps(["music", "focus", "lofi"]),
     "duration_min": 60, "content_type": "audio",
     "content_url": "https://www.youtube.com/watch?v=jfKfPfyJRdk", "active": True},
]

for r in resources:
    db.add(Resource(**r))

db.commit()
db.close()
print("[OK] Database seeded successfully!")
print(f"   - {len(questions)} questions added")
print(f"   - {len(resources)} resources added")
