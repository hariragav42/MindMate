from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.db.database import engine, Base
import os
import app.models

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MindMate API")

# Configure CORS for production and local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://mind-mate-five-orcin.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory and serve static files
UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

from app.api import auth, admin, student, chat

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(student.router)
app.include_router(chat.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to MindMate API"}

@app.get("/api/debug-env")
def debug_env():
    import os
    from app.db.database import SQLALCHEMY_DATABASE_URL
    return {
        "url": SQLALCHEMY_DATABASE_URL,
        "env_var": os.getenv("DATABASE_URL")
    }

@app.get("/api/debug-routes")
def debug_routes():
    routes = []
    for r in app.routes:
        if type(r).__name__ == '_IncludedRouter':
            routes.extend([getattr(route, 'path', str(route)) for route in r.include_context.included_router.routes])
        else:
            routes.append(getattr(r, 'path', str(r)))
    return {"routes": routes}