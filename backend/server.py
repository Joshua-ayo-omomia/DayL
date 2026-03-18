from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.responses import FileResponse, StreamingResponse
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import json
import io
from reportlab.lib.pagesizes import letter, landscape
from reportlab.pdfgen import canvas
from reportlab.lib.colors import Color, HexColor
from reportlab.lib.units import inch

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ.get('JWT_SECRET', 'realloc_secret_2026')

UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
CERTIFICATES_DIR = ROOT_DIR / "certificates"
CERTIFICATES_DIR.mkdir(exist_ok=True)

app = FastAPI(title="Realloc API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ============== MODELS ==============

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    enterprise_access_code: Optional[str] = None

class SubmissionCreate(BaseModel):
    task_id: str
    domain_id: str
    title: str
    description: str
    project_url: str
    notes: Optional[str] = None

class SubmissionReview(BaseModel):
    status: str
    admin_feedback: str

class ThreadCreate(BaseModel):
    task_id: Optional[str] = None
    cohort_id: Optional[str] = None
    content: str

class ReplyCreate(BaseModel):
    content: str

class BusinessCaseCreate(BaseModel):
    problem: str
    current_state: str
    proposed_solution: str
    outcome_category: str
    projected_impact: Dict[str, Any]

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
    if user["role"] not in ["super_admin", "enterprise_admin"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

async def require_enterprise(user: dict = Depends(get_current_user)):
    if user["role"] not in ["super_admin", "enterprise_admin"]:
        raise HTTPException(status_code=403, detail="Enterprise access required")
    return user

async def require_mentor(user: dict = Depends(get_current_user)):
    if user["role"] not in ["super_admin", "mentor"]:
        raise HTTPException(status_code=403, detail="Mentor access required")
    return user

# ============== PUBLIC ROUTES ==============

@api_router.get("/health")
async def health():
    return {"status": "healthy", "platform": "Realloc"}

# ============== AUTH ROUTES ==============

@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        "id": str(uuid.uuid4()),
        "email": user_data.email,
        "password_hash": hash_password(user_data.password),
        "name": user_data.name,
        "role": "participant",
        "enterprise_id": None,
        "cohort_id": None,
        "mentor_id": None,
        "personalized_track_name": None,
        "worker_id": None,
        "onboarding_completed": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    await db.users.insert_one(user_doc)
    token = create_token(user_doc["id"], user_doc["role"])
    return {"token": token, "user": {k: v for k, v in user_doc.items() if k not in ["password_hash", "_id"]}}

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
            "enterprise_id": user.get("enterprise_id"),
            "cohort_id": user.get("cohort_id"),
            "worker_id": user.get("worker_id"),
            "personalized_track_name": user.get("personalized_track_name"),
            "onboarding_completed": user.get("onboarding_completed", True)
        }
    }

@api_router.get("/auth/me")
async def get_me(user: dict = Depends(get_current_user)):
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
        "enterprise_id": user.get("enterprise_id"),
        "cohort_id": user.get("cohort_id"),
        "mentor_id": user.get("mentor_id"),
        "worker_id": user.get("worker_id"),
        "personalized_track_name": user.get("personalized_track_name"),
        "onboarding_completed": user.get("onboarding_completed", True)
    }

# ============== ENTERPRISE ROUTES ==============

@api_router.get("/enterprise/{enterprise_id}/dashboard")
async def enterprise_dashboard(enterprise_id: str, user: dict = Depends(require_enterprise)):
    enterprise = await db.enterprises.find_one({"id": enterprise_id}, {"_id": 0})
    if not enterprise:
        raise HTTPException(status_code=404, detail="Enterprise not found")

    total_workers = await db.workers.count_documents({"enterprise_id": enterprise_id})
    rising = await db.workers.count_documents({"enterprise_id": enterprise_id, "displacement_category": "rising"})
    stable = await db.workers.count_documents({"enterprise_id": enterprise_id, "displacement_category": "stable"})
    at_risk = await db.workers.count_documents({"enterprise_id": enterprise_id, "displacement_category": "at_risk"})

    sa_completed = await db.workers.count_documents({"enterprise_id": enterprise_id, "sa_status": "completed"})
    completion_rate = round(sa_completed / total_workers * 100) if total_workers > 0 else 0

    cohorts = await db.cohorts.find({"enterprise_id": enterprise_id}, {"_id": 0}).to_list(10)
    active_cohorts = len([c for c in cohorts if c.get("status") == "active"])

    builder_core = await db.workers.find(
        {"enterprise_id": enterprise_id, "builder_classification": {"$in": ["Core Builder", "Emerging Builder"]}},
        {"_id": 0}
    ).sort("mv_score", -1).limit(5).to_list(5)

    active_cohort = next((c for c in cohorts if c.get("status") == "active"), None)

    # ROI projection data
    avg_salary = 85000
    retrain_cost = 12000
    external_hire_cost = 145000
    builders_in_training = len([c for c in cohorts if c.get("status") == "active"])
    active_participants = 0
    if active_cohort:
        active_participants = len(active_cohort.get("participant_ids", []))
    projected_savings = active_participants * (external_hire_cost - retrain_cost)
    roi_data = {
        "avg_salary": avg_salary,
        "retrain_cost_per_worker": retrain_cost,
        "external_hire_cost": external_hire_cost,
        "workers_in_training": active_participants,
        "projected_annual_savings": projected_savings,
        "cost_to_retrain": active_participants * retrain_cost,
        "cost_to_replace": active_participants * external_hire_cost,
        "business_outcomes": active_cohort.get("business_outcomes", {}) if active_cohort else {}
    }

    # Risk reduction timeline (monthly snapshots showing trend)
    risk_timeline = [
        {"month": "Oct 2025", "at_risk_pct": 38, "stable_pct": 35, "rising_pct": 27},
        {"month": "Nov 2025", "at_risk_pct": 35, "stable_pct": 37, "rising_pct": 28},
        {"month": "Dec 2025", "at_risk_pct": 32, "stable_pct": 38, "rising_pct": 30},
        {"month": "Jan 2026", "at_risk_pct": 29, "stable_pct": 39, "rising_pct": 32},
        {"month": "Feb 2026", "at_risk_pct": 27, "stable_pct": 41, "rising_pct": 32},
        {"month": "Mar 2026", "at_risk_pct": 24, "stable_pct": 42, "rising_pct": 34},
    ]

    # Upskilling progress for builder core members
    builder_classifications = ["Core Builder", "Emerging Builder", "Core Builder (behavioral)", "Core Builder (role-based)"]
    all_builders = await db.workers.find(
        {"enterprise_id": enterprise_id, "builder_classification": {"$in": builder_classifications}},
        {"_id": 0}
    ).sort("mv_score", -1).to_list(50)

    upskilling_progress = []
    for w in all_builders:
        user_account = await db.users.find_one({"worker_id": w["id"]}, {"_id": 0})
        if user_account:
            domains = await db.domains.find({"participant_id": user_account["id"]}, {"_id": 0}).to_list(10)
            total_tasks = 0
            completed_tasks = 0
            current_domain = None
            for d in domains:
                tasks = await db.tasks.find({"domain_id": d["id"]}, {"_id": 0, "id": 1}).to_list(20)
                domain_completed = 0
                for t in tasks:
                    prog = await db.progress.find_one({"user_id": user_account["id"], "task_id": t["id"]})
                    if prog and prog.get("status") == "completed":
                        completed_tasks += 1
                        domain_completed += 1
                total_tasks += len(tasks)
                if domain_completed < len(tasks) and not current_domain:
                    current_domain = d.get("title")
            subs_total = await db.submissions.count_documents({"user_id": user_account["id"]})
            subs_passed = await db.submissions.count_documents({"user_id": user_account["id"], "status": "pass"})
            if total_tasks > 0:
                upskilling_progress.append({
                    "worker_id": w["id"],
                    "name": w["name"],
                    "role_title": w["role_title"],
                    "department": w["department"],
                    "track_name": user_account.get("personalized_track_name", ""),
                    "total_tasks": total_tasks,
                    "completed_tasks": completed_tasks,
                    "completion_pct": round(completed_tasks / total_tasks * 100) if total_tasks > 0 else 0,
                    "current_domain": current_domain or "Not started",
                    "submissions": subs_total,
                    "passed": subs_passed,
                    "displacement_category": w.get("displacement_category"),
                })

    return {
        "enterprise": enterprise,
        "stats": {
            "total_workers": total_workers,
            "countries": len(enterprise.get("countries", [])),
            "active_cohorts": active_cohorts,
            "completion_rate": completion_rate
        },
        "displacement": {"rising": rising, "stable": stable, "at_risk": at_risk},
        "builder_core_preview": builder_core,
        "active_cohort": active_cohort,
        "cohorts": cohorts,
        "roi_data": roi_data,
        "risk_timeline": risk_timeline,
        "upskilling_progress": upskilling_progress
    }

@api_router.get("/enterprise/{enterprise_id}/heatmap")
async def enterprise_heatmap(
    enterprise_id: str,
    country: Optional[str] = None,
    department: Optional[str] = None,
    category: Optional[str] = None,
    user: dict = Depends(require_enterprise)
):
    query = {"enterprise_id": enterprise_id}
    if country:
        query["country"] = country
    if department:
        query["department"] = department
    if category:
        query["displacement_category"] = category

    workers = await db.workers.find(query, {
        "_id": 0, "id": 1, "name": 1, "role_title": 1, "department": 1,
        "country": 1, "sa_score": 1, "mv_score": 1, "displacement_direction_score": 1,
        "displacement_category": 1, "sa_status": 1, "mv_status": 1
    }).to_list(1000)

    total = len(workers)
    rising = len([w for w in workers if w.get("displacement_category") == "rising"])
    stable = len([w for w in workers if w.get("displacement_category") == "stable"])
    at_risk = len([w for w in workers if w.get("displacement_category") == "at_risk"])

    all_workers_count = await db.workers.count_documents({"enterprise_id": enterprise_id})

    countries = await db.workers.distinct("country", {"enterprise_id": enterprise_id})
    departments = await db.workers.distinct("department", {"enterprise_id": enterprise_id})

    return {
        "workers": workers,
        "summary": {"showing": total, "total": all_workers_count, "rising": rising, "stable": stable, "at_risk": at_risk},
        "filters": {"countries": sorted(countries), "departments": sorted(departments)}
    }

@api_router.get("/enterprise/{enterprise_id}/workers/{worker_id}")
async def get_worker(enterprise_id: str, worker_id: str, user: dict = Depends(require_enterprise)):
    worker = await db.workers.find_one({"id": worker_id, "enterprise_id": enterprise_id}, {"_id": 0})
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    cohort = None
    if worker.get("cohort_id"):
        cohort = await db.cohorts.find_one({"id": worker["cohort_id"]}, {"_id": 0})

    return {"worker": worker, "cohort": cohort}

@api_router.get("/enterprise/{enterprise_id}/builder-core")
async def get_builder_core(enterprise_id: str, user: dict = Depends(require_enterprise)):
    workers = await db.workers.find(
        {"enterprise_id": enterprise_id, "builder_classification": {"$in": ["Core Builder", "Emerging Builder", "Core Builder (behavioral)", "Core Builder (role-based)"]}},
        {"_id": 0}
    ).sort("mv_score", -1).to_list(50)

    return {"candidates": workers}

@api_router.get("/enterprise/{enterprise_id}/cohorts")
async def get_cohorts(enterprise_id: str, user: dict = Depends(require_enterprise)):
    cohorts = await db.cohorts.find({"enterprise_id": enterprise_id}, {"_id": 0}).to_list(20)

    for cohort in cohorts:
        participant_count = await db.users.count_documents({"cohort_id": cohort["id"], "role": "participant"})
        cohort["participant_count"] = participant_count
        mentors = await db.mentors.find({"assigned_cohort_ids": cohort["id"]}, {"_id": 0, "name": 1, "credential": 1}).to_list(5)
        cohort["mentors"] = mentors

    return {"cohorts": cohorts}

@api_router.get("/enterprise/{enterprise_id}/cohorts/{cohort_id}")
async def get_cohort_detail(enterprise_id: str, cohort_id: str, user: dict = Depends(require_enterprise)):
    cohort = await db.cohorts.find_one({"id": cohort_id, "enterprise_id": enterprise_id}, {"_id": 0})
    if not cohort:
        raise HTTPException(status_code=404, detail="Cohort not found")

    participants = await db.users.find(
        {"cohort_id": cohort_id, "role": "participant"},
        {"_id": 0, "password_hash": 0}
    ).to_list(50)

    for p in participants:
        worker = await db.workers.find_one({"id": p.get("worker_id")}, {"_id": 0, "name": 1, "role_title": 1, "country": 1, "displacement_category": 1})
        if worker:
            p["worker"] = worker
        domains = await db.domains.find({"participant_id": p["id"]}, {"_id": 0}).sort("order", 1).to_list(10)
        total_tasks = 0
        completed_tasks = 0
        for d in domains:
            tasks = await db.tasks.find({"domain_id": d["id"]}, {"_id": 0}).to_list(20)
            total_tasks += len(tasks)
            for t in tasks:
                prog = await db.progress.find_one({"user_id": p["id"], "task_id": t["id"]}, {"_id": 0})
                if prog and prog.get("status") == "completed":
                    completed_tasks += 1
        p["progress"] = {"completed": completed_tasks, "total": total_tasks}

    mentors = await db.mentors.find({"assigned_cohort_ids": cohort_id}, {"_id": 0}).to_list(5)

    country_dist = {}
    for p in participants:
        w = p.get("worker", {})
        c = w.get("country", "Unknown")
        country_dist[c] = country_dist.get(c, 0) + 1

    return {
        "cohort": cohort,
        "participants": participants,
        "mentors": mentors,
        "composition": {"country_distribution": country_dist, "total": len(participants)}
    }

# ============== BOARD REPORT ==============

@api_router.get("/enterprise/{enterprise_id}/report")
async def generate_board_report(enterprise_id: str, user: dict = Depends(require_enterprise)):
    enterprise = await db.enterprises.find_one({"id": enterprise_id}, {"_id": 0})
    if not enterprise:
        raise HTTPException(status_code=404, detail="Enterprise not found")

    total = await db.workers.count_documents({"enterprise_id": enterprise_id})
    rising = await db.workers.count_documents({"enterprise_id": enterprise_id, "displacement_category": "rising"})
    stable = await db.workers.count_documents({"enterprise_id": enterprise_id, "displacement_category": "stable"})
    at_risk = await db.workers.count_documents({"enterprise_id": enterprise_id, "displacement_category": "at_risk"})
    sa_done = await db.workers.count_documents({"enterprise_id": enterprise_id, "sa_status": "completed"})

    builder_core = await db.workers.find(
        {"enterprise_id": enterprise_id, "builder_classification": {"$in": ["Core Builder", "Emerging Builder", "Core Builder (behavioral)", "Core Builder (role-based)"]}},
        {"_id": 0, "name": 1, "role_title": 1, "department": 1, "sa_score": 1, "mv_score": 1, "builder_classification": 1, "displacement_direction_score": 1}
    ).sort("mv_score", -1).limit(10).to_list(10)

    cohort = await db.cohorts.find_one({"enterprise_id": enterprise_id, "status": "active"}, {"_id": 0})

    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    w, h = letter

    # Page 1: Title
    c.setFillColor(HexColor("#0A0A0A"))
    c.rect(0, 0, w, h, fill=1)

    c.setFillColor(HexColor("#FFFFFF"))
    c.setFont("Helvetica-Bold", 28)
    c.drawString(50, h - 80, "REALLOC")

    c.setFont("Helvetica", 12)
    c.setFillColor(HexColor("#A6A6A6"))
    c.drawString(50, h - 100, "Workforce Reallocation Infrastructure")

    c.setFillColor(HexColor("#FFFFFF"))
    c.setFont("Helvetica-Bold", 22)
    c.drawString(50, h - 180, f"{enterprise['name']}")
    c.setFont("Helvetica", 14)
    c.drawString(50, h - 205, "Technology Capability Assessment Report")

    c.setFillColor(HexColor("#A6A6A6"))
    c.setFont("Helvetica", 11)
    c.drawString(50, h - 250, f"Date: {datetime.now(timezone.utc).strftime('%B %d, %Y')}")
    c.drawString(50, h - 268, f"Workers Assessed: {total}")
    c.drawString(50, h - 286, f"Countries: {len(enterprise.get('countries', []))}")
    c.drawString(50, h - 304, f"Assessment Completion: {round(sa_done/total*100) if total else 0}%")

    # Executive Summary
    y = h - 370
    c.setFillColor(HexColor("#FFFFFF"))
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "Executive Summary")
    y -= 30

    c.setFont("Helvetica", 11)
    c.setFillColor(HexColor("#D4D4D4"))
    lines = [
        f"Realloc assessed {total} technology workers across {len(enterprise.get('countries', []))} countries.",
        f"Displacement analysis: {rising} Rising, {stable} Stable, {at_risk} At Risk.",
        f"Assessment completion rate: {round(sa_done/total*100) if total else 0}%.",
        "",
        "Displacement Distribution:",
        f"  Rising (roles specializing): {rising} workers ({round(rising/total*100)}%)",
        f"  Stable (monitoring required): {stable} workers ({round(stable/total*100)}%)",
        f"  At Risk (roles commoditizing): {at_risk} workers ({round(at_risk/total*100)}%)",
    ]
    for line in lines:
        c.drawString(50, y, line)
        y -= 16

    # Builder Core
    y -= 20
    c.setFillColor(HexColor("#FFFFFF"))
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "Builder Core: Top 10 Candidates")
    y -= 25

    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(HexColor("#A6A6A6"))
    c.drawString(50, y, "NAME")
    c.drawString(220, y, "ROLE")
    c.drawString(420, y, "SA")
    c.drawString(450, y, "MV")
    c.drawString(480, y, "CLASSIFICATION")
    y -= 15

    c.setFont("Helvetica", 9)
    c.setFillColor(HexColor("#D4D4D4"))
    for bc in builder_core:
        c.drawString(50, y, bc.get("name", "")[:25])
        c.drawString(220, y, bc.get("role_title", "")[:30])
        c.drawString(420, y, str(bc.get("sa_score", "-")))
        c.drawString(450, y, str(bc.get("mv_score", "-")))
        c.drawString(480, y, bc.get("builder_classification", ""))
        y -= 14

    # Page 2
    c.showPage()
    c.setFillColor(HexColor("#0A0A0A"))
    c.rect(0, 0, w, h, fill=1)

    y = h - 60
    c.setFillColor(HexColor("#FFFFFF"))
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "Cohort 1 Plan")
    y -= 30

    c.setFont("Helvetica", 11)
    c.setFillColor(HexColor("#D4D4D4"))
    if cohort:
        cohort_lines = [
            f"Participants: {len(cohort.get('participant_ids', []))}",
            f"Start Date: {cohort.get('start_date', 'TBD')}",
            f"Location: {cohort.get('location', 'TBD')}",
            f"Duration: {cohort.get('total_weeks', 12)} weeks",
            "",
            "Projected Business Outcomes:",
            f"  Cost Savings: ${cohort.get('business_outcomes', {}).get('projected_cost_savings_annual', 0):,}/year",
            f"  Hours Reclaimed: {cohort.get('business_outcomes', {}).get('projected_hours_reclaimed_weekly', 0)}/week",
            f"  Speed Improvement: {cohort.get('business_outcomes', {}).get('projected_speed_improvement_pct', 0)}%",
        ]
    else:
        cohort_lines = ["No active cohort data available."]

    for line in cohort_lines:
        c.drawString(50, y, line)
        y -= 16

    y -= 30
    c.setFillColor(HexColor("#FFFFFF"))
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "Timeline")
    y -= 25

    c.setFont("Helvetica", 11)
    c.setFillColor(HexColor("#D4D4D4"))
    timeline = [
        "Assessment Phase: December 2025 - March 2026",
        "Cohort 1: April - June 2026",
        "Outcome Measurement: July 2026",
        "Cohort 2 Planning: July 2026",
        "Cohort 2 Launch: July 2026",
        "Full Year: 4 cohorts planned for 2026",
    ]
    for line in timeline:
        c.drawString(50, y, line)
        y -= 16

    y -= 30
    c.setFillColor(HexColor("#A6A6A6"))
    c.setFont("Helvetica", 9)
    c.drawString(50, y, "Generated by Realloc. Workforce reallocation infrastructure for the AI era.")
    c.drawString(50, y - 14, "A THCO Company.")

    c.save()
    buf.seek(0)

    return StreamingResponse(
        buf,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=realloc_board_report_{enterprise['name'].replace(' ', '_')}.pdf"}
    )

# ============== LEARN (PARTICIPANT) ROUTES ==============

@api_router.get("/learn/dashboard")
async def learn_dashboard(user: dict = Depends(get_current_user)):
    worker = None
    if user.get("worker_id"):
        worker = await db.workers.find_one({"id": user["worker_id"]}, {"_id": 0})

    domains = await db.domains.find({"participant_id": user["id"]}, {"_id": 0}).sort("order", 1).to_list(10)

    for domain in domains:
        tasks = await db.tasks.find({"domain_id": domain["id"]}, {"_id": 0}).sort("order", 1).to_list(20)
        completed = 0
        for t in tasks:
            prog = await db.progress.find_one({"user_id": user["id"], "task_id": t["id"]}, {"_id": 0})
            if prog and prog.get("status") == "completed":
                completed += 1
        domain["tasks_completed"] = completed
        domain["tasks_total"] = len(tasks)

    submissions = await db.submissions.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).limit(5).to_list(5)

    mentor = None
    if user.get("mentor_id"):
        mentor = await db.mentors.find_one({"id": user["mentor_id"]}, {"_id": 0})

    next_session = None
    if user.get("mentor_id"):
        next_session = await db.mentor_sessions.find_one(
            {"participant_id": user["id"], "status": "scheduled"},
            {"_id": 0}
        )

    activity = []
    if user.get("cohort_id"):
        activity = await db.activity_feed.find(
            {"cohort_id": user["cohort_id"]},
            {"_id": 0}
        ).sort("created_at", -1).limit(10).to_list(10)

    # AI Readiness Score calculation
    all_domains = await db.domains.find({"participant_id": user["id"]}, {"_id": 0}).to_list(10)
    total_t = 0
    completed_t = 0
    for d in all_domains:
        ts = await db.tasks.find({"domain_id": d["id"]}, {"_id": 0, "id": 1}).to_list(20)
        total_t += len(ts)
        for t in ts:
            p = await db.progress.find_one({"user_id": user["id"], "task_id": t["id"]})
            if p and p.get("status") == "completed":
                completed_t += 1

    all_subs = await db.submissions.find({"user_id": user["id"]}, {"_id": 0}).to_list(100)
    passed_subs = [s for s in all_subs if s.get("status") == "pass"]
    task_pct = (completed_t / total_t * 100) if total_t > 0 else 0
    pass_rate = (len(passed_subs) / len(all_subs) * 100) if len(all_subs) > 0 else 0
    ai_readiness = round(min(100, task_pct * 0.6 + pass_rate * 0.3 + (10 if mentor else 0)))

    # Skill dimensions from worker profile
    skill_dimensions = worker.get("skill_dimensions", {}) if worker else {}

    # Achievements
    achievements = []
    if completed_t > 0:
        achievements.append({"id": "first_task", "title": "First Task Complete", "icon": "check", "earned": True})
    if len(passed_subs) > 0:
        achievements.append({"id": "first_pass", "title": "First Mentor Approval", "icon": "star", "earned": True})
    if mentor:
        achievements.append({"id": "mentor_matched", "title": "Mentor Matched", "icon": "user", "earned": True})
    if completed_t >= 4:
        achievements.append({"id": "domain_master", "title": "Domain Mastered", "icon": "award", "earned": True})
    if len(passed_subs) >= 3:
        achievements.append({"id": "triple_pass", "title": "Hat Trick", "icon": "zap", "earned": True, "desc": "3 submissions approved"})
    # Add locked achievements
    if completed_t < total_t:
        if not any(a["id"] == "domain_master" for a in achievements):
            achievements.append({"id": "domain_master", "title": "Domain Mastered", "icon": "award", "earned": False})
    achievements.append({"id": "capstone", "title": "Capstone Submitted", "icon": "flag", "earned": False})
    achievements.append({"id": "cohort_top3", "title": "Cohort Top 3", "icon": "trophy", "earned": False})

    return {
        "user": {"name": user["name"], "role": user.get("role"), "personalized_track_name": user.get("personalized_track_name")},
        "worker": worker,
        "domains": domains,
        "submissions": submissions,
        "mentor": mentor,
        "next_session": next_session,
        "activity": activity,
        "ai_readiness": ai_readiness,
        "skill_dimensions": skill_dimensions,
        "achievements": achievements
    }

@api_router.get("/learn/diagnostic")
async def learn_diagnostic(user: dict = Depends(get_current_user)):
    if not user.get("worker_id"):
        raise HTTPException(status_code=404, detail="No diagnostic data available")

    worker = await db.workers.find_one({"id": user["worker_id"]}, {"_id": 0})
    if not worker:
        raise HTTPException(status_code=404, detail="Worker profile not found")

    safe_worker = {k: v for k, v in worker.items() if k not in [
        "manager_top_quote", "manager_development_note", "builder_classification"
    ]}
    return {"diagnostic": safe_worker}

@api_router.get("/learn/domains")
async def get_participant_domains(user: dict = Depends(get_current_user)):
    domains = await db.domains.find({"participant_id": user["id"]}, {"_id": 0}).sort("order", 1).to_list(10)
    for domain in domains:
        tasks = await db.tasks.find({"domain_id": domain["id"]}, {"_id": 0, "id": 1, "title": 1, "order": 1}).sort("order", 1).to_list(20)
        domain["tasks"] = tasks
    return {"domains": domains}

@api_router.get("/learn/domains/{domain_id}/tasks")
async def get_domain_tasks(domain_id: str, user: dict = Depends(get_current_user)):
    domain = await db.domains.find_one({"id": domain_id}, {"_id": 0})
    if not domain:
        raise HTTPException(status_code=404, detail="Domain not found")
    tasks = await db.tasks.find({"domain_id": domain_id}, {"_id": 0}).sort("order", 1).to_list(20)

    for t in tasks:
        prog = await db.progress.find_one({"user_id": user["id"], "task_id": t["id"]}, {"_id": 0})
        t["progress_status"] = prog.get("status", "locked") if prog else "locked"
        sub = await db.submissions.find_one({"user_id": user["id"], "task_id": t["id"]}, {"_id": 0})
        t["submission"] = sub

    return {"domain": domain, "tasks": tasks}

@api_router.get("/learn/domains/{domain_id}/tasks/{task_id}")
async def get_task_detail(domain_id: str, task_id: str, user: dict = Depends(get_current_user)):
    task = await db.tasks.find_one({"id": task_id, "domain_id": domain_id}, {"_id": 0})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    domain = await db.domains.find_one({"id": domain_id}, {"_id": 0})
    progress = await db.progress.find_one({"user_id": user["id"], "task_id": task_id}, {"_id": 0})
    submissions = await db.submissions.find({"user_id": user["id"], "task_id": task_id}, {"_id": 0}).sort("created_at", -1).to_list(10)
    threads = await db.discussion_threads.find({"task_id": task_id}, {"_id": 0}).sort("created_at", -1).to_list(20)

    return {
        "task": task,
        "domain": domain,
        "progress": progress,
        "submissions": submissions,
        "threads": threads
    }

# ============== SUBMISSIONS ==============

@api_router.post("/submissions")
async def create_submission(data: SubmissionCreate, user: dict = Depends(get_current_user)):
    existing = await db.submissions.find({"user_id": user["id"], "task_id": data.task_id}, {"_id": 0}).to_list(10)
    review_cycle = len(existing) + 1

    submission = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "task_id": data.task_id,
        "domain_id": data.domain_id,
        "cohort_id": user.get("cohort_id"),
        "title": data.title,
        "description": data.description,
        "project_url": data.project_url,
        "notes": data.notes,
        "status": "pending",
        "admin_feedback": None,
        "reviewer_name": None,
        "reviewer_credential": None,
        "review_cycle": review_cycle,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "reviewed_at": None
    }

    await db.submissions.insert_one(submission)
    del submission["_id"]

    await db.progress.update_one(
        {"user_id": user["id"], "task_id": data.task_id},
        {"$set": {"status": "in_progress"}},
        upsert=True
    )

    return {"message": "Submission created", "id": submission["id"]}

@api_router.get("/submissions")
async def get_submissions(status: Optional[str] = None, user: dict = Depends(get_current_user)):
    if user["role"] in ["super_admin", "enterprise_admin", "mentor"]:
        query = {}
        if status:
            query["status"] = status
        submissions = await db.submissions.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    else:
        submissions = await db.submissions.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return submissions

@api_router.post("/submissions/{submission_id}/review")
async def review_submission(submission_id: str, review: SubmissionReview, user: dict = Depends(get_current_user)):
    if user["role"] not in ["super_admin", "mentor", "enterprise_admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    submission = await db.submissions.find_one({"id": submission_id}, {"_id": 0})
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    mentor_info = await db.mentors.find_one({"user_id": user["id"]}, {"_id": 0})

    await db.submissions.update_one(
        {"id": submission_id},
        {"$set": {
            "status": review.status,
            "admin_feedback": review.admin_feedback,
            "reviewer_name": mentor_info["name"] if mentor_info else user["name"],
            "reviewer_credential": mentor_info.get("credential") if mentor_info else None,
            "reviewed_at": datetime.now(timezone.utc).isoformat()
        }}
    )

    if review.status == "pass":
        await db.progress.update_one(
            {"user_id": submission["user_id"], "task_id": submission["task_id"]},
            {"$set": {"status": "completed", "completed_at": datetime.now(timezone.utc).isoformat()}}
        )

    return {"message": "Submission reviewed"}

# ============== COMMUNITY ==============

@api_router.get("/community/feed")
async def get_community_feed(cohort_id: Optional[str] = None, user: dict = Depends(get_current_user)):
    query = {}
    if cohort_id:
        query["cohort_id"] = cohort_id
    elif user.get("cohort_id"):
        query["cohort_id"] = user["cohort_id"]
    feed = await db.activity_feed.find(query, {"_id": 0}).sort("created_at", -1).limit(30).to_list(30)
    return {"feed": feed}

@api_router.get("/community/threads")
async def get_threads(task_id: Optional[str] = None, cohort_id: Optional[str] = None, user: dict = Depends(get_current_user)):
    query = {}
    if task_id:
        query["task_id"] = task_id
    if cohort_id:
        query["cohort_id"] = cohort_id
    threads = await db.discussion_threads.find(query, {"_id": 0}).sort("created_at", -1).to_list(50)
    return {"threads": threads}

@api_router.post("/community/threads")
async def create_thread(data: ThreadCreate, user: dict = Depends(get_current_user)):
    thread = {
        "id": str(uuid.uuid4()),
        "task_id": data.task_id,
        "cohort_id": data.cohort_id or user.get("cohort_id"),
        "author_id": user["id"],
        "author_name": user["name"],
        "author_role": user["role"],
        "content": data.content,
        "replies": [],
        "upvotes": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.discussion_threads.insert_one(thread)
    del thread["_id"]
    return thread

@api_router.post("/community/threads/{thread_id}/replies")
async def add_reply(thread_id: str, data: ReplyCreate, user: dict = Depends(get_current_user)):
    mentor_info = await db.mentors.find_one({"user_id": user["id"]}, {"_id": 0})
    reply = {
        "id": str(uuid.uuid4()),
        "author_id": user["id"],
        "author_name": user["name"],
        "author_role": user["role"],
        "author_credential": mentor_info.get("credential") if mentor_info else None,
        "content": data.content,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.discussion_threads.update_one({"id": thread_id}, {"$push": {"replies": reply}})
    return reply

@api_router.get("/community/hub")
async def community_hub():
    mentors = await db.mentors.find({"is_active": True}, {"_id": 0}).to_list(10)
    return {"mentors": mentors}

# ============== MENTOR / SESSIONS ==============

@api_router.get("/mentor/dashboard")
async def mentor_dashboard(user: dict = Depends(require_mentor)):
    mentor = await db.mentors.find_one({"user_id": user["id"]}, {"_id": 0})
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor profile not found")

    pending_subs = await db.submissions.find({"status": "pending"}, {"_id": 0}).sort("created_at", -1).to_list(50)

    sessions = await db.mentor_sessions.find(
        {"mentor_id": mentor["id"]},
        {"_id": 0}
    ).sort("date", -1).to_list(20)

    cohort_ids = mentor.get("assigned_cohort_ids", [])
    participants = []
    for cid in cohort_ids:
        ps = await db.users.find({"cohort_id": cid, "role": "participant"}, {"_id": 0, "password_hash": 0}).to_list(50)
        participants.extend(ps)

    return {
        "mentor": mentor,
        "pending_submissions": pending_subs,
        "sessions": sessions,
        "participants": participants
    }

@api_router.get("/sessions")
async def get_sessions(
    participant_id: Optional[str] = None,
    mentor_id: Optional[str] = None,
    user: dict = Depends(get_current_user)
):
    query = {}
    if participant_id:
        query["participant_id"] = participant_id
    elif mentor_id:
        query["mentor_id"] = mentor_id
    elif user["role"] == "participant":
        query["participant_id"] = user["id"]
    elif user["role"] == "mentor":
        mentor = await db.mentors.find_one({"user_id": user["id"]}, {"_id": 0})
        if mentor:
            query["mentor_id"] = mentor["id"]

    sessions = await db.mentor_sessions.find(query, {"_id": 0}).sort("date", -1).to_list(50)
    return {"sessions": sessions}

@api_router.get("/learn/mentor")
async def get_my_mentor(user: dict = Depends(get_current_user)):
    if not user.get("mentor_id"):
        return {"mentor": None, "sessions": [], "reviews": []}

    mentor = await db.mentors.find_one({"id": user["mentor_id"]}, {"_id": 0})
    sessions = await db.mentor_sessions.find(
        {"participant_id": user["id"]},
        {"_id": 0}
    ).sort("date", -1).to_list(20)

    reviews = await db.submissions.find(
        {"user_id": user["id"], "status": {"$ne": "pending"}},
        {"_id": 0}
    ).sort("reviewed_at", -1).to_list(20)

    return {"mentor": mentor, "sessions": sessions, "reviews": reviews}

# ============== NOTIFICATIONS ==============

@api_router.get("/notifications")
async def get_notifications(user: dict = Depends(get_current_user)):
    notifications = await db.notifications.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).limit(10).to_list(10)
    return {"notifications": notifications}

# ============== BUSINESS CASES ==============

@api_router.get("/business-cases")
async def get_business_cases(user: dict = Depends(get_current_user)):
    cases = await db.business_cases.find({"participant_id": user["id"]}, {"_id": 0}).to_list(10)
    return {"cases": cases}

@api_router.post("/business-cases")
async def create_business_case(data: BusinessCaseCreate, user: dict = Depends(get_current_user)):
    case = {
        "id": str(uuid.uuid4()),
        "participant_id": user["id"],
        "cohort_id": user.get("cohort_id"),
        "problem": data.problem,
        "current_state": data.current_state,
        "proposed_solution": data.proposed_solution,
        "outcome_category": data.outcome_category,
        "projected_impact": data.projected_impact,
        "status": "draft",
        "mentor_approved": False,
        "mentor_feedback": None,
        "actual_impact": None,
        "measured_at": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.business_cases.insert_one(case)
    del case["_id"]
    return case

@api_router.put("/business-cases/{case_id}")
async def update_business_case(case_id: str, data: BusinessCaseCreate, user: dict = Depends(get_current_user)):
    await db.business_cases.update_one(
        {"id": case_id, "participant_id": user["id"]},
        {"$set": {
            "problem": data.problem,
            "current_state": data.current_state,
            "proposed_solution": data.proposed_solution,
            "outcome_category": data.outcome_category,
            "projected_impact": data.projected_impact
        }}
    )
    return {"message": "Business case updated"}

# ============== ADMIN ROUTES ==============

@api_router.get("/admin/analytics")
async def get_analytics(user: dict = Depends(require_admin)):
    enterprises = await db.enterprises.count_documents({})
    total_workers = await db.workers.count_documents({})
    active_cohorts = await db.cohorts.count_documents({"status": "active"})

    rising = await db.workers.count_documents({"displacement_category": "rising"})
    stable = await db.workers.count_documents({"displacement_category": "stable"})
    at_risk = await db.workers.count_documents({"displacement_category": "at_risk"})

    return {
        "enterprises": enterprises,
        "total_workers": total_workers,
        "active_cohorts": active_cohorts,
        "displacement": {"rising": rising, "stable": stable, "at_risk": at_risk}
    }

# ============== SEED ==============

@api_router.post("/seed")
async def seed_data():
    existing = await db.enterprises.find_one({}, {"_id": 0})
    if existing:
        return {"message": "Seed data already exists"}

    from seed import run_seed
    result = await run_seed(db, hash_password)
    return result

@api_router.post("/seed/reset")
async def reset_and_seed():
    collections = ["enterprises", "workers", "cohorts", "mentors", "domains", "tasks",
                    "users", "submissions", "progress", "discussion_threads", "mentor_sessions",
                    "activity_feed", "notifications", "business_cases", "certificates",
                    "applications", "modules", "tracks", "student_progress"]
    for col in collections:
        await db[col].drop()

    from seed import run_seed
    result = await run_seed(db, hash_password)
    return result

# ============== FILE SERVING ==============

@api_router.get("/uploads/{filename}")
async def get_upload(filename: str):
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

@api_router.get("/certificates/{filename}")
async def get_certificate_file(filename: str):
    file_path = CERTIFICATES_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Certificate not found")
    return FileResponse(file_path, media_type="application/pdf", filename=filename)

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
