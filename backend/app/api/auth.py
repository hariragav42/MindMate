from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests
import uuid

from app.db.database import get_db
from app.models import User, StudentProfile
from app.schemas import UserCreate, UserLogin, Token, User as UserSchema
from app.auth.security import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

GOOGLE_CLIENT_ID = "910680532480-vu152fh6jdi5f17jv87vlfci0tg6huel.apps.googleusercontent.com"

class GoogleAuthRequest(BaseModel):
    token: str

@router.post("/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    hashed_password = get_password_hash(user_in.password)
    # Check if this is the first user, make them admin (optional shortcut for testing)
    is_first = db.query(User).count() == 0
    role = "admin" if is_first else "student"
    
    db_user = User(email=user_in.email, password_hash=hashed_password, role=role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Initialize profile
    if role == "student":
        profile = StudentProfile(user_id=db_user.id)
        db.add(profile)
        db.commit()
        
    return db_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"email": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user_id": user.id, "role": user.role}

@router.get("/me", response_model=UserSchema)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/google", response_model=Token)
def google_auth(request: GoogleAuthRequest, db: Session = Depends(get_db)):
    print(f"Received Google Auth request with token: {request.token[:10]}...")
    try:
        # Verify the token with Google
        idinfo = id_token.verify_oauth2_token(
            request.token, requests.Request(), GOOGLE_CLIENT_ID
        )
        print(f"Token verified successfully. Email: {idinfo.get('email')}")

        email = idinfo['email']
        name = idinfo.get('name', '')
        picture = idinfo.get('picture', '')

        user = db.query(User).filter(User.email == email).first()

        if not user:
            print("Creating new user for Google Sign In")
            # Create a new user for Google Sign In
            dummy_password = str(uuid.uuid4())
            is_first = db.query(User).count() == 0
            role = "admin" if is_first else "student"
            
            user = User(
                email=email,
                password_hash=get_password_hash(dummy_password),
                role=role
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
            if role == "student":
                profile = StudentProfile(
                    user_id=user.id,
                    full_name=name,
                    profile_pic_url=picture
                )
                db.add(profile)
                db.commit()

        # Generate standard access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"email": user.email}, expires_delta=access_token_expires
        )
        print(f"Generated access token for user {user.email}")
        return {"access_token": access_token, "token_type": "bearer", "user_id": user.id, "role": user.role, "email": user.email}

    except ValueError as e:
        print(f"ValueError during token verification: {e}")
        # Invalid token
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        print(f"Unexpected error during google auth: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )
