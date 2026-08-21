from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="student") # student, admin
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    profile = relationship("StudentProfile", back_populates="user", uselist=False)
    assessments = relationship("Assessment", back_populates="user")
    preferences = relationship("Preference", back_populates="user")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    full_name = Column(String)
    profile_pic_url = Column(String)
    study_year = Column(String)
    study_hours = Column(String)
    available_time = Column(String)
    support_preference = Column(String)

    user = relationship("User", back_populates="profile")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    type = Column(String, nullable=False) # single, multi
    options_json = Column(Text) # JSON string of options
    active = Column(Boolean, default=True)
    order_no = Column(Integer)


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    submitted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    predicted_level = Column(String) # Low, Moderate, High
    model_version = Column(String)

    user = relationship("User", back_populates="assessments")
    answers = relationship("AssessmentAnswer", back_populates="assessment")
    selections = relationship("AssessmentAnswerSelection", back_populates="assessment")
    recommendations = relationship("Recommendation", back_populates="assessment")


class AssessmentAnswer(Base):
    __tablename__ = "assessment_answers"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    answer_value = Column(String)

    assessment = relationship("Assessment", back_populates="answers")
    question = relationship("Question")


class AssessmentAnswerSelection(Base):
    __tablename__ = "assessment_answer_selections"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    option_value = Column(String)

    assessment = relationship("Assessment", back_populates="selections")
    question = relationship("Question")


class Preference(Base):
    __tablename__ = "preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    preference_type = Column(String) # e.g., Q10 or Q11
    preference_value = Column(String)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="preferences")


class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String)
    tags_json = Column(Text)
    duration_min = Column(Integer)
    content_type = Column(String) # animation, audio, video, exercise, meditation, article, external_link
    content_url = Column(String)
    content_text = Column(Text)
    thumbnail_url = Column(String)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"))
    resource_id = Column(Integer, ForeignKey("resources.id"))
    rank = Column(Integer)
    score = Column(Float)
    reason = Column(String)

    assessment = relationship("Assessment", back_populates="recommendations")
    resource = relationship("Resource")
    feedback = relationship("RecommendationFeedback", back_populates="recommendation", uselist=False)


class RecommendationFeedback(Base):
    __tablename__ = "recommendation_feedback"

    id = Column(Integer, primary_key=True, index=True)
    recommendation_id = Column(Integer, ForeignKey("recommendations.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(String) # Yes, A little, No
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    recommendation = relationship("Recommendation", back_populates="feedback")
    user = relationship("User")


class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, default="Untitled")
    content = Column(Text, nullable=False)
    mood_tag = Column(String)  # e.g., "Happy", "Calm", "Stressed"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User")
