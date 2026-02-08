from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.responses import FileResponse
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import asyncio
import json
import aiofiles
from reportlab.lib.pagesizes import letter, landscape
from reportlab.pdfgen import canvas
from reportlab.lib.colors import Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import anthropic
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# API Keys
ANTHROPIC_API_KEY = os.environ.get('ANTHROPIC_API_KEY')
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
JWT_SECRET = os.environ.get('JWT_SECRET', 'daylearning_secret')

# Configure Resend
resend.api_key = RESEND_API_KEY

# Create uploads directory
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
CERTIFICATES_DIR = ROOT_DIR / "certificates"
CERTIFICATES_DIR.mkdir(exist_ok=True)

# Create the main app
app = FastAPI(title="Day Learning API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ============== MODELS ==============

class ApplicationCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    brief: Optional[str] = None
    why_join: str
    experience_years: str
    skill_area: str
    commitment: bool = True

class Application(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    resume_url: Optional[str] = None
    brief: Optional[str] = None
    why_join: str
    experience_years: str
    skill_area: str
    commitment: bool = True
    ai_screening_result: Optional[Dict[str, Any]] = None
    status: str = "pending_review"
    invitation_code: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    invitation_code: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    password_hash: str
    name: str
    role: str = "student"
    profile_photo: Optional[str] = None
    application_id: Optional[str] = None
    onboarding_completed: bool = False
    onboarding_items: Dict[str, bool] = Field(default_factory=lambda: {
        "code_of_conduct": False,
        "how_it_works": False,
        "dev_environment": False,
        "join_community": False,
        "confirm_commitment": False
    })
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Track(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    icon: str = "code"
    is_active: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Module(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    track_id: str
    title: str
    description: str
    order: int
    video_url: str
    resources: List[Dict[str, str]] = []
    has_assessment: bool = False
    assessment_prompt: Optional[str] = None
    is_published: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ModuleCreate(BaseModel):
    track_id: str
    title: str
    description: str
    order: int
    video_url: str
    resources: List[Dict[str, str]] = []
    has_assessment: bool = False
    assessment_prompt: Optional[str] = None
    is_published: bool = True

class StudentProgress(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    module_id: str
    status: str = "locked"
    completed_at: Optional[str] = None

class SubmissionCreate(BaseModel):
    module_id: str
    title: str
    description: str
    project_url: str
    notes: Optional[str] = None

class Submission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    module_id: str
    title: str
    description: str
    project_url: str
    screenshots: List[str] = []
    notes: Optional[str] = None
    status: str = "pending"
    admin_feedback: Optional[str] = None
    reviewed_by: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    reviewed_at: Optional[str] = None

class SubmissionReview(BaseModel):
    status: str
    admin_feedback: str

class Certificate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    track_id: str
    issued_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    certificate_url: Optional[str] = None

# ============== AUTH HELPERS ==============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_token(user_id: str, role: str) -> str:
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
        user = await db.users.find_one({"id": payload["user_id"]}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def require_admin(user: dict = Depends(get_current_user)):
    if user["role"] not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

async def require_reviewer(user: dict = Depends(get_current_user)):
    if user["role"] not in ["admin", "super_admin", "reviewer"]:
        raise HTTPException(status_code=403, detail="Reviewer access required")
    return user

# ============== PUBLIC ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "Day Learning API", "status": "running"}

@api_router.get("/health")
async def health():
    return {"status": "healthy"}

# ============== AUTH ROUTES ==============

@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    role = "student"
    application_id = None
    
    if user_data.invitation_code:
        application = await db.applications.find_one({"invitation_code": user_data.invitation_code}, {"_id": 0})
        if not application:
            raise HTTPException(status_code=400, detail="Invalid invitation code")
        if application["status"] != "approved":
            raise HTTPException(status_code=400, detail="Application not approved")
        application_id = application["id"]
    
    user = User(
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        name=user_data.name,
        role=role,
        application_id=application_id
    )
    
    await db.users.insert_one(user.model_dump())
    token = create_token(user.id, user.role)
    
    return {"token": token, "user": {"id": user.id, "email": user.email, "name": user.name, "role": user.role}}

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user["id"], user["role"])
    return {
        "token": token, 
        "user": {
            "id": user["id"], 
            "email": user["email"], 
            "name": user["name"], 
            "role": user["role"],
            "onboarding_completed": user.get("onboarding_completed", False)
        }
    }

@api_router.get("/auth/me")
async def get_me(user: dict = Depends(get_current_user)):
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
        "onboarding_completed": user.get("onboarding_completed", False),
        "onboarding_items": user.get("onboarding_items", {}),
        "profile_photo": user.get("profile_photo")
    }

# ============== APPLICATION ROUTES ==============

@api_router.post("/applications")
async def create_application(
    full_name: str = Form(...),
    email: str = Form(...),
    phone: Optional[str] = Form(None),
    linkedin_url: Optional[str] = Form(None),
    brief: Optional[str] = Form(None),
    why_join: str = Form(...),
    experience_years: str = Form(...),
    skill_area: str = Form(...),
    commitment: bool = Form(True),
    resume: Optional[UploadFile] = File(None)
):
    existing = await db.applications.find_one({"email": email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Application already exists for this email")
    
    resume_url = None
    if resume:
        file_ext = Path(resume.filename).suffix
        file_name = f"{uuid.uuid4()}{file_ext}"
        file_path = UPLOAD_DIR / file_name
        async with aiofiles.open(file_path, 'wb') as f:
            content = await resume.read()
            await f.write(content)
        resume_url = f"/api/uploads/{file_name}"
    
    if not resume_url and not brief:
        raise HTTPException(status_code=400, detail="Either resume or brief is required")
    
    application = Application(
        full_name=full_name,
        email=email,
        phone=phone,
        linkedin_url=linkedin_url,
        resume_url=resume_url,
        brief=brief,
        why_join=why_join,
        experience_years=experience_years,
        skill_area=skill_area,
        commitment=commitment
    )
    
    await db.applications.insert_one(application.model_dump())
    return {"message": "Application submitted successfully", "id": application.id}

@api_router.get("/applications")
async def get_applications(
    status: Optional[str] = None,
    user: dict = Depends(require_admin)
):
    query = {}
    if status:
        query["status"] = status
    applications = await db.applications.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return applications

@api_router.get("/applications/{application_id}")
async def get_application(application_id: str, user: dict = Depends(require_admin)):
    application = await db.applications.find_one({"id": application_id}, {"_id": 0})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application

@api_router.post("/applications/{application_id}/screen")
async def screen_application(application_id: str, user: dict = Depends(require_admin)):
    application = await db.applications.find_one({"id": application_id}, {"_id": 0})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    await db.applications.update_one({"id": application_id}, {"$set": {"status": "under_ai_review"}})
    
    screening_prompt = f"""You are screening applicants for Day Learning, an AI engineering training program. 

We are looking for people who:
- Have real programming/software engineering experience (minimum 1 year)
- Can demonstrate they have actually built things (not just completed tutorials)
- Show commitment and motivation to learn AI skills
- Have a growth mindset

We are NOT looking for:
- Complete beginners with no coding experience
- People who only list course completions with no real work
- Vague applications with no substance

Applicant Information:
- Name: {application['full_name']}
- Experience: {application['experience_years']} years
- Skill Area: {application['skill_area']}
- Why they want to join: {application['why_join']}
- Brief/Background: {application.get('brief', 'Not provided')}
- LinkedIn: {application.get('linkedin_url', 'Not provided')}

Review this application and return a JSON response:
{{
  "decision": "approve" | "reject" | "maybe",
  "confidence": 0-100,
  "reasoning": "Brief explanation of decision",
  "strengths": ["list of strengths"],
  "concerns": ["list of concerns if any"],
  "suggested_track": "AI Engineer"
}}

Return ONLY the JSON, no other text."""

    try:
        client_anthropic = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        message = client_anthropic.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            messages=[{"role": "user", "content": screening_prompt}]
        )
        
        response_text = message.content[0].text.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
        
        ai_result = json.loads(response_text)
        
        await db.applications.update_one(
            {"id": application_id},
            {"$set": {"ai_screening_result": ai_result, "status": "ai_reviewed"}}
        )
        
        return {"message": "AI screening completed", "result": ai_result}
    except Exception as e:
        logger.error(f"AI screening error: {e}")
        await db.applications.update_one({"id": application_id}, {"$set": {"status": "pending_review"}})
        raise HTTPException(status_code=500, detail=f"AI screening failed: {str(e)}")

@api_router.post("/applications/{application_id}/approve")
async def approve_application(application_id: str, user: dict = Depends(require_admin)):
    application = await db.applications.find_one({"id": application_id}, {"_id": 0})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    invitation_code = str(uuid.uuid4())[:8].upper()
    
    await db.applications.update_one(
        {"id": application_id},
        {"$set": {"status": "approved", "invitation_code": invitation_code}}
    )
    
    try:
        email_html = f"""
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #EDEDE9; padding: 40px;">
            <h1 style="color: #2A9D8F; font-family: 'Playfair Display', serif;">Congratulations! 🎉</h1>
            <p>Dear {application['full_name']},</p>
            <p>We're thrilled to inform you that you've been accepted to <strong>Day Learning's AI Engineer Track</strong>!</p>
            <p>Your application demonstrated exactly what we're looking for: real experience, genuine passion, and the drive to grow.</p>
            <h2 style="color: #E9C46A;">Next Steps:</h2>
            <ol>
                <li>Use your invitation code to create your account: <strong style="color: #2A9D8F;">{invitation_code}</strong></li>
                <li>Complete the onboarding checklist</li>
                <li>Start your AI engineering journey!</li>
            </ol>
            <p style="margin-top: 30px;">Welcome to the Day Learning community.</p>
            <p><em>The Day Learning Team at THCO</em></p>
        </div>
        """
        
        await asyncio.to_thread(
            resend.Emails.send,
            {
                "from": SENDER_EMAIL,
                "to": [application["email"]],
                "subject": "Congratulations! You've been accepted to Day Learning 🎉",
                "html": email_html
            }
        )
    except Exception as e:
        logger.error(f"Email sending failed: {e}")
    
    return {"message": "Application approved", "invitation_code": invitation_code}

@api_router.post("/applications/{application_id}/reject")
async def reject_application(application_id: str, user: dict = Depends(require_admin)):
    application = await db.applications.find_one({"id": application_id}, {"_id": 0})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    await db.applications.update_one({"id": application_id}, {"$set": {"status": "rejected"}})
    
    try:
        email_html = f"""
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #EDEDE9; padding: 40px;">
            <h1 style="color: #E76F51;">Application Update</h1>
            <p>Dear {application['full_name']},</p>
            <p>Thank you for your interest in Day Learning. After careful review, we've decided not to move forward with your application at this time.</p>
            <p>This doesn't mean the end of your journey. We encourage you to:</p>
            <ul>
                <li>Continue building and shipping projects</li>
                <li>Gain more hands-on experience</li>
                <li>Reapply in the future when you have more experience to share</li>
            </ul>
            <p>Keep building, keep learning.</p>
            <p><em>The Day Learning Team at THCO</em></p>
        </div>
        """
        
        await asyncio.to_thread(
            resend.Emails.send,
            {
                "from": SENDER_EMAIL,
                "to": [application["email"]],
                "subject": "Day Learning Application Update",
                "html": email_html
            }
        )
    except Exception as e:
        logger.error(f"Email sending failed: {e}")
    
    return {"message": "Application rejected"}

# ============== TRACK & MODULE ROUTES ==============

@api_router.get("/tracks")
async def get_tracks():
    tracks = await db.tracks.find({"is_active": True}, {"_id": 0}).to_list(100)
    return tracks

@api_router.get("/tracks/{track_id}")
async def get_track(track_id: str):
    track = await db.tracks.find_one({"id": track_id}, {"_id": 0})
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
    return track

@api_router.post("/tracks")
async def create_track(track: Track, user: dict = Depends(require_admin)):
    await db.tracks.insert_one(track.model_dump())
    return track

@api_router.get("/modules")
async def get_modules(track_id: Optional[str] = None):
    query = {"is_published": True}
    if track_id:
        query["track_id"] = track_id
    modules = await db.modules.find(query, {"_id": 0}).sort("order", 1).to_list(100)
    return modules

@api_router.get("/modules/{module_id}")
async def get_module(module_id: str):
    module = await db.modules.find_one({"id": module_id}, {"_id": 0})
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    return module

@api_router.post("/modules")
async def create_module(module_data: ModuleCreate, user: dict = Depends(require_admin)):
    module = Module(**module_data.model_dump())
    await db.modules.insert_one(module.model_dump())
    return module

@api_router.put("/modules/{module_id}")
async def update_module(module_id: str, module_data: ModuleCreate, user: dict = Depends(require_admin)):
    result = await db.modules.update_one(
        {"id": module_id},
        {"$set": module_data.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Module not found")
    return {"message": "Module updated"}

@api_router.delete("/modules/{module_id}")
async def delete_module(module_id: str, user: dict = Depends(require_admin)):
    result = await db.modules.delete_one({"id": module_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Module not found")
    return {"message": "Module deleted"}

# ============== ONBOARDING ROUTES ==============

@api_router.put("/onboarding/item/{item_key}")
async def update_onboarding_item(item_key: str, user: dict = Depends(get_current_user)):
    valid_items = ["code_of_conduct", "how_it_works", "dev_environment", "join_community", "confirm_commitment"]
    if item_key not in valid_items:
        raise HTTPException(status_code=400, detail="Invalid onboarding item")
    
    onboarding_items = user.get("onboarding_items", {})
    onboarding_items[item_key] = True
    
    all_completed = all(onboarding_items.get(item, False) for item in valid_items)
    
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"onboarding_items": onboarding_items, "onboarding_completed": all_completed}}
    )
    
    if all_completed:
        track = await db.tracks.find_one({"is_active": True}, {"_id": 0})
        if track:
            modules = await db.modules.find({"track_id": track["id"], "is_published": True}, {"_id": 0}).sort("order", 1).to_list(100)
            for i, module in enumerate(modules):
                existing = await db.progress.find_one({"user_id": user["id"], "module_id": module["id"]}, {"_id": 0})
                if not existing:
                    progress = StudentProgress(
                        user_id=user["id"],
                        module_id=module["id"],
                        status="available" if i == 0 else "locked"
                    )
                    await db.progress.insert_one(progress.model_dump())
    
    return {"message": "Onboarding item updated", "onboarding_completed": all_completed}

@api_router.get("/onboarding/status")
async def get_onboarding_status(user: dict = Depends(get_current_user)):
    return {
        "onboarding_items": user.get("onboarding_items", {}),
        "onboarding_completed": user.get("onboarding_completed", False)
    }

# ============== PROGRESS ROUTES ==============

@api_router.get("/progress")
async def get_progress(user: dict = Depends(get_current_user)):
    progress = await db.progress.find({"user_id": user["id"]}, {"_id": 0}).to_list(100)
    return progress

@api_router.post("/progress/{module_id}/complete")
async def complete_module(module_id: str, user: dict = Depends(get_current_user)):
    progress = await db.progress.find_one({"user_id": user["id"], "module_id": module_id}, {"_id": 0})
    if not progress:
        raise HTTPException(status_code=404, detail="Progress not found")
    
    if progress["status"] != "available" and progress["status"] != "in_progress":
        raise HTTPException(status_code=400, detail="Module not available")
    
    module = await db.modules.find_one({"id": module_id}, {"_id": 0})
    if module and module.get("has_assessment"):
        submission = await db.submissions.find_one(
            {"user_id": user["id"], "module_id": module_id, "status": "pass"},
            {"_id": 0}
        )
        if not submission:
            raise HTTPException(status_code=400, detail="Assessment required before completion")
    
    await db.progress.update_one(
        {"user_id": user["id"], "module_id": module_id},
        {"$set": {"status": "completed", "completed_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    all_modules = await db.modules.find({"track_id": module["track_id"]}, {"_id": 0}).sort("order", 1).to_list(100)
    current_index = next((i for i, m in enumerate(all_modules) if m["id"] == module_id), -1)
    
    if current_index < len(all_modules) - 1:
        next_module = all_modules[current_index + 1]
        await db.progress.update_one(
            {"user_id": user["id"], "module_id": next_module["id"]},
            {"$set": {"status": "available"}}
        )
    
    return {"message": "Module completed"}

@api_router.post("/progress/{module_id}/start")
async def start_module(module_id: str, user: dict = Depends(get_current_user)):
    progress = await db.progress.find_one({"user_id": user["id"], "module_id": module_id}, {"_id": 0})
    if not progress:
        raise HTTPException(status_code=404, detail="Progress not found")
    
    if progress["status"] == "locked":
        raise HTTPException(status_code=400, detail="Module is locked")
    
    if progress["status"] == "available":
        await db.progress.update_one(
            {"user_id": user["id"], "module_id": module_id},
            {"$set": {"status": "in_progress"}}
        )
    
    return {"message": "Module started"}

# ============== SUBMISSION ROUTES ==============

@api_router.post("/submissions")
async def create_submission(
    module_id: str = Form(...),
    title: str = Form(...),
    description: str = Form(...),
    project_url: str = Form(...),
    notes: Optional[str] = Form(None),
    screenshots: List[UploadFile] = File([]),
    user: dict = Depends(get_current_user)
):
    screenshot_urls = []
    for screenshot in screenshots[:3]:
        file_ext = Path(screenshot.filename).suffix
        file_name = f"{uuid.uuid4()}{file_ext}"
        file_path = UPLOAD_DIR / file_name
        async with aiofiles.open(file_path, 'wb') as f:
            content = await screenshot.read()
            await f.write(content)
        screenshot_urls.append(f"/api/uploads/{file_name}")
    
    submission = Submission(
        user_id=user["id"],
        module_id=module_id,
        title=title,
        description=description,
        project_url=project_url,
        screenshots=screenshot_urls,
        notes=notes
    )
    
    await db.submissions.insert_one(submission.model_dump())
    return {"message": "Submission created", "id": submission.id}

@api_router.get("/submissions")
async def get_submissions(
    status: Optional[str] = None,
    user: dict = Depends(get_current_user)
):
    if user["role"] in ["admin", "super_admin", "reviewer"]:
        query = {}
        if status:
            query["status"] = status
        submissions = await db.submissions.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    else:
        submissions = await db.submissions.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return submissions

@api_router.get("/submissions/{submission_id}")
async def get_submission(submission_id: str, user: dict = Depends(get_current_user)):
    submission = await db.submissions.find_one({"id": submission_id}, {"_id": 0})
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    if user["role"] not in ["admin", "super_admin", "reviewer"] and submission["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return submission

@api_router.post("/submissions/{submission_id}/review")
async def review_submission(
    submission_id: str,
    review: SubmissionReview,
    user: dict = Depends(require_reviewer)
):
    submission = await db.submissions.find_one({"id": submission_id}, {"_id": 0})
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    if review.status not in ["pass", "needs_work", "fail"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    await db.submissions.update_one(
        {"id": submission_id},
        {"$set": {
            "status": review.status,
            "admin_feedback": review.admin_feedback,
            "reviewed_by": user["id"],
            "reviewed_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    if review.status == "pass":
        await db.progress.update_one(
            {"user_id": submission["user_id"], "module_id": submission["module_id"]},
            {"$set": {"status": "completed", "completed_at": datetime.now(timezone.utc).isoformat()}}
        )
        
        module = await db.modules.find_one({"id": submission["module_id"]}, {"_id": 0})
        if module:
            all_modules = await db.modules.find({"track_id": module["track_id"]}, {"_id": 0}).sort("order", 1).to_list(100)
            current_index = next((i for i, m in enumerate(all_modules) if m["id"] == module["id"]), -1)
            
            if current_index < len(all_modules) - 1:
                next_module = all_modules[current_index + 1]
                await db.progress.update_one(
                    {"user_id": submission["user_id"], "module_id": next_module["id"]},
                    {"$set": {"status": "available"}}
                )
    
    return {"message": "Submission reviewed"}

# ============== CERTIFICATE ROUTES ==============

@api_router.post("/certificates/generate")
async def generate_certificate(user: dict = Depends(get_current_user)):
    track = await db.tracks.find_one({"is_active": True}, {"_id": 0})
    if not track:
        raise HTTPException(status_code=404, detail="No active track found")
    
    modules = await db.modules.find({"track_id": track["id"], "is_published": True}, {"_id": 0}).to_list(100)
    progress = await db.progress.find({"user_id": user["id"]}, {"_id": 0}).to_list(100)
    
    completed_modules = [p for p in progress if p["status"] == "completed"]
    if len(completed_modules) < len(modules):
        raise HTTPException(status_code=400, detail="Not all modules completed")
    
    existing_cert = await db.certificates.find_one({"user_id": user["id"], "track_id": track["id"]}, {"_id": 0})
    if existing_cert:
        return {"certificate_url": existing_cert["certificate_url"]}
    
    cert_id = str(uuid.uuid4())
    cert_filename = f"certificate_{cert_id}.pdf"
    cert_path = CERTIFICATES_DIR / cert_filename
    
    c = canvas.Canvas(str(cert_path), pagesize=landscape(letter))
    width, height = landscape(letter)
    
    c.setFillColor(Color(10/255, 10/255, 10/255))
    c.rect(0, 0, width, height, fill=1)
    
    c.setFillColor(Color(42/255, 157/255, 143/255))
    c.rect(30, 30, width-60, height-60, stroke=1, fill=0)
    c.setStrokeColor(Color(42/255, 157/255, 143/255))
    c.setLineWidth(2)
    c.rect(30, 30, width-60, height-60, stroke=1, fill=0)
    
    c.setFillColor(Color(237/255, 237/255, 233/255))
    c.setFont("Helvetica-Bold", 48)
    c.drawCentredString(width/2, height - 120, "CERTIFICATE OF COMPLETION")
    
    c.setFont("Helvetica", 20)
    c.drawCentredString(width/2, height - 180, "This certifies that")
    
    c.setFillColor(Color(233/255, 196/255, 106/255))
    c.setFont("Helvetica-Bold", 36)
    c.drawCentredString(width/2, height - 230, user["name"])
    
    c.setFillColor(Color(237/255, 237/255, 233/255))
    c.setFont("Helvetica", 20)
    c.drawCentredString(width/2, height - 280, "has successfully completed the")
    
    c.setFillColor(Color(42/255, 157/255, 143/255))
    c.setFont("Helvetica-Bold", 32)
    c.drawCentredString(width/2, height - 330, track["name"])
    
    c.setFillColor(Color(237/255, 237/255, 233/255))
    c.setFont("Helvetica", 18)
    c.drawCentredString(width/2, height - 370, "at Day Learning by THCO")
    
    issue_date = datetime.now(timezone.utc).strftime("%B %d, %Y")
    c.setFont("Helvetica", 14)
    c.drawCentredString(width/2, 80, f"Issued on {issue_date}")
    
    c.setFont("Helvetica", 12)
    c.setFillColor(Color(166/255, 166/255, 166/255))
    c.drawCentredString(width/2, 50, f"Certificate ID: {cert_id}")
    
    c.save()
    
    certificate = Certificate(
        id=cert_id,
        user_id=user["id"],
        track_id=track["id"],
        certificate_url=f"/api/certificates/{cert_filename}"
    )
    await db.certificates.insert_one(certificate.model_dump())
    
    return {"certificate_url": certificate.certificate_url, "id": cert_id}

@api_router.get("/certificates/{filename}")
async def get_certificate_file(filename: str):
    file_path = CERTIFICATES_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Certificate not found")
    return FileResponse(file_path, media_type="application/pdf", filename=filename)

@api_router.get("/certificates")
async def get_user_certificates(user: dict = Depends(get_current_user)):
    certificates = await db.certificates.find({"user_id": user["id"]}, {"_id": 0}).to_list(100)
    return certificates

# ============== ADMIN ROUTES ==============

@api_router.get("/admin/students")
async def get_students(user: dict = Depends(require_admin)):
    students = await db.users.find({"role": "student"}, {"_id": 0, "password_hash": 0}).to_list(1000)
    
    for student in students:
        progress = await db.progress.find({"user_id": student["id"]}, {"_id": 0}).to_list(100)
        completed = len([p for p in progress if p["status"] == "completed"])
        total = len(progress)
        student["progress"] = {"completed": completed, "total": total}
    
    return students

@api_router.get("/admin/analytics")
async def get_analytics(user: dict = Depends(require_admin)):
    total_applications = await db.applications.count_documents({})
    approved_applications = await db.applications.count_documents({"status": "approved"})
    rejected_applications = await db.applications.count_documents({"status": "rejected"})
    pending_applications = await db.applications.count_documents({"status": {"$in": ["pending_review", "ai_reviewed"]}})
    
    total_students = await db.users.count_documents({"role": "student"})
    onboarded_students = await db.users.count_documents({"role": "student", "onboarding_completed": True})
    
    total_submissions = await db.submissions.count_documents({})
    passed_submissions = await db.submissions.count_documents({"status": "pass"})
    pending_submissions = await db.submissions.count_documents({"status": "pending"})
    
    total_certificates = await db.certificates.count_documents({})
    
    return {
        "applications": {
            "total": total_applications,
            "approved": approved_applications,
            "rejected": rejected_applications,
            "pending": pending_applications,
            "approval_rate": round(approved_applications / total_applications * 100, 1) if total_applications > 0 else 0
        },
        "students": {
            "total": total_students,
            "onboarded": onboarded_students,
            "onboarding_rate": round(onboarded_students / total_students * 100, 1) if total_students > 0 else 0
        },
        "submissions": {
            "total": total_submissions,
            "passed": passed_submissions,
            "pending": pending_submissions,
            "pass_rate": round(passed_submissions / total_submissions * 100, 1) if total_submissions > 0 else 0
        },
        "certificates": {
            "total": total_certificates
        }
    }

@api_router.put("/admin/users/{user_id}/role")
async def update_user_role(user_id: str, role: str, admin: dict = Depends(require_admin)):
    if admin["role"] != "super_admin":
        raise HTTPException(status_code=403, detail="Only super admin can change roles")
    
    if role not in ["student", "admin", "super_admin", "reviewer"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    result = await db.users.update_one({"id": user_id}, {"$set": {"role": role}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "Role updated"}

@api_router.get("/admin/users")
async def get_all_users(user: dict = Depends(require_admin)):
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(1000)
    return users

# ============== FILE SERVING ==============

@api_router.get("/uploads/{filename}")
async def get_upload(filename: str):
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

# ============== SEED DATA ==============

@api_router.post("/seed")
async def seed_data():
    existing_track = await db.tracks.find_one({"name": "AI Engineer"}, {"_id": 0})
    if existing_track:
        return {"message": "Seed data already exists"}
    
    track = Track(
        name="AI Engineer",
        description="Learn to build and deploy AI-powered solutions. For developers who want to leverage AI in their work.",
        icon="cpu"
    )
    await db.tracks.insert_one(track.model_dump())
    
    modules_data = [
        {
            "title": "Introduction to AI-Powered Development",
            "description": "Understand what it means to build with AI, not just use it. Learn the mindset shift required to become an AI engineer.",
            "order": 1,
            "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "resources": [
                {"title": "What is AI Engineering?", "url": "https://example.com/ai-engineering"},
                {"title": "The AI-First Mindset", "url": "https://example.com/ai-mindset"}
            ],
            "has_assessment": False
        },
        {
            "title": "Prompt Engineering Fundamentals",
            "description": "Learn to communicate with AI models effectively to get production-quality output. Master the art of crafting prompts.",
            "order": 2,
            "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "resources": [
                {"title": "Prompt Engineering Guide", "url": "https://example.com/prompt-guide"},
                {"title": "Best Practices", "url": "https://example.com/prompt-practices"}
            ],
            "has_assessment": True,
            "assessment_prompt": "Build a prompt chain that takes a user requirement and generates a working code snippet. Submit your GitHub repo."
        },
        {
            "title": "Building Your First AI Application",
            "description": "Put it all together. Build a real application powered by AI. From concept to working prototype.",
            "order": 3,
            "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "resources": [
                {"title": "AI App Architecture", "url": "https://example.com/ai-architecture"},
                {"title": "Integration Patterns", "url": "https://example.com/integration"}
            ],
            "has_assessment": True,
            "assessment_prompt": "Build and deploy a working AI-powered application. Submit the live link and repo."
        },
        {
            "title": "Deployment & Production Readiness",
            "description": "Ship it. Learn to deploy, monitor, and maintain AI applications in production environments.",
            "order": 4,
            "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "resources": [
                {"title": "Deployment Guide", "url": "https://example.com/deployment"},
                {"title": "Monitoring AI Apps", "url": "https://example.com/monitoring"}
            ],
            "has_assessment": True,
            "assessment_prompt": "Deploy your Module 3 project to production with proper error handling and monitoring. Submit the live URL."
        }
    ]
    
    for module_data in modules_data:
        module = Module(track_id=track.id, **module_data)
        await db.modules.insert_one(module.model_dump())
    
    admin_exists = await db.users.find_one({"email": "admin@daylearning.com"}, {"_id": 0})
    if not admin_exists:
        admin = User(
            email="admin@daylearning.com",
            password_hash=hash_password("admin123"),
            name="Day Learning Admin",
            role="super_admin",
            onboarding_completed=True
        )
        await db.users.insert_one(admin.model_dump())
    
    return {"message": "Seed data created successfully", "track_id": track.id}

# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
