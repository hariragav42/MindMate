from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
from datetime import datetime

# --- Auth Schemas ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    role: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserBase(BaseModel):
    email: EmailStr
    role: str

class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Profile Schemas ---
class StudentProfileBase(BaseModel):
    full_name: Optional[str] = None
    profile_pic_url: Optional[str] = None
    study_year: Optional[str] = None
    study_hours: Optional[str] = None
    available_time: Optional[str] = None
    support_preference: Optional[str] = None

class StudentProfileCreate(StudentProfileBase):
    pass

class StudentProfile(StudentProfileBase):
    user_id: int

    class Config:
        from_attributes = True

# --- Question Schemas ---
class QuestionBase(BaseModel):
    text: str
    type: str
    options_json: str
    active: bool = True
    order_no: Optional[int] = None

class QuestionCreate(QuestionBase):
    pass

class QuestionUpdate(QuestionBase):
    pass

class Question(QuestionBase):
    id: int

    class Config:
        from_attributes = True

# --- Resource Schemas ---
class ResourceBase(BaseModel):
    title: str
    category: Optional[str] = None
    tags_json: Optional[str] = None
    duration_min: Optional[int] = None
    content_type: Optional[str] = None
    content_url: Optional[str] = None
    content_text: Optional[str] = None
    thumbnail_url: Optional[str] = None
    active: bool = True

class ResourceCreate(ResourceBase):
    pass

class ResourceUpdate(ResourceBase):
    pass

class Resource(ResourceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Assessment Schemas ---
class AnswerSubmit(BaseModel):
    question_id: int
    answer_value: Optional[str] = None
    option_values: Optional[List[str]] = None

class AssessmentSubmit(BaseModel):
    answers: List[AnswerSubmit]

class AssessmentResult(BaseModel):
    id: int
    predicted_level: str
    submitted_at: datetime

    class Config:
        from_attributes = True

# --- Recommendation Schemas ---
class RecommendationResponse(BaseModel):
    id: int
    rank: int
    score: float
    reason: str
    resource: Resource

    class Config:
        from_attributes = True

class RecommendationFeedbackSubmit(BaseModel):
    rating: str

# --- Error Schema ---
class ErrorResponse(BaseModel):
    code: str
    message: str
    details: Optional[Any] = None
