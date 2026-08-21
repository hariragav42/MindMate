from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models import User, Question, Resource
from app.schemas import (Question as QuestionSchema, QuestionCreate, QuestionUpdate,
                         Resource as ResourceSchema, ResourceCreate, ResourceUpdate)
from app.auth.dependencies import get_current_admin_user

router = APIRouter(prefix="/api/admin", tags=["admin"])

# --- Questions ---
@router.get("/questions", response_model=List[QuestionSchema])
def read_questions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db),
                   current_user: User = Depends(get_current_admin_user)):
    return db.query(Question).offset(skip).limit(limit).all()

@router.post("/questions", response_model=QuestionSchema)
def create_question(question: QuestionCreate, db: Session = Depends(get_db),
                    current_user: User = Depends(get_current_admin_user)):
    db_question = Question(**question.model_dump())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

@router.put("/questions/{question_id}", response_model=QuestionSchema)
def update_question(question_id: int, question: QuestionUpdate, db: Session = Depends(get_db),
                    current_user: User = Depends(get_current_admin_user)):
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    for key, value in question.model_dump().items():
        setattr(db_question, key, value)
    db.commit()
    db.refresh(db_question)
    return db_question

@router.delete("/questions/{question_id}")
def delete_question(question_id: int, db: Session = Depends(get_db),
                    current_user: User = Depends(get_current_admin_user)):
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    db_question.active = False
    db.commit()
    return {"message": "Question deactivated"}

# --- Resources ---
@router.get("/resources", response_model=List[ResourceSchema])
def read_resources(skip: int = 0, limit: int = 100, db: Session = Depends(get_db),
                   current_user: User = Depends(get_current_admin_user)):
    return db.query(Resource).offset(skip).limit(limit).all()

@router.post("/resources", response_model=ResourceSchema)
def create_resource(resource: ResourceCreate, db: Session = Depends(get_db),
                    current_user: User = Depends(get_current_admin_user)):
    db_resource = Resource(**resource.model_dump())
    db.add(db_resource)
    db.commit()
    db.refresh(db_resource)
    return db_resource

@router.put("/resources/{resource_id}", response_model=ResourceSchema)
def update_resource(resource_id: int, resource: ResourceUpdate, db: Session = Depends(get_db),
                    current_user: User = Depends(get_current_admin_user)):
    db_resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not db_resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    for key, value in resource.model_dump(exclude_unset=True).items():
        setattr(db_resource, key, value)
    db.commit()
    db.refresh(db_resource)
    return db_resource

@router.delete("/resources/{resource_id}")
def delete_resource(resource_id: int, db: Session = Depends(get_db),
                    current_user: User = Depends(get_current_admin_user)):
    db_resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not db_resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    db_resource.active = False
    db.commit()
    return {"message": "Resource deactivated"}
