# Day Learning - Product Requirements Document (PRD)

## Overview

**Product Name:** Day Learning  
**Tagline:** "Learn AI. Work On Real Things. Get Hired."  
**Parent Company:** THCO  
**Version:** 1.0 MVP  
**Last Updated:** February 2026

---

## Brand & Identity

### Origin Story
Day Learning is named after **Thomas Day**, a 19th-century furniture maker whose craftsmanship was so exceptional he became the largest employer of labor in North Carolina. His work wasn't just good, it was undeniable. Clients traveled from across the state because no one else built at his level.

That standard is what we want our graduates to carry. We don't just teach AI. We train people to build with the kind of excellence that stands out, the kind that makes you the first call, not the backup option.

### Brand Guidelines
- **Primary Color:** Teal (#2A9D8F)
- **Secondary Color:** Amber (#E9C46A)
- **Accent Color:** Coral (#E76F51)
- **Background:** Dark (#0A0A0A)
- **Text:** Light (#EDEDE9)
- **Font (Headings):** Playfair Display
- **Font (Body):** Inter
- **Tone:** Professional but warm. Smart mentor who believes in you.

---

## What Day Learning Is

Day Learning is an AI upskilling platform that trains experienced professionals to become AI-powered experts. We don't teach from scratch — we take people who already know how to build and teach them how to leverage AI in their work.

**Key Differentiators:**
- For experienced professionals only (1+ years)
- Project-based, not tutorial-based
- AI screens all applications for quality
- Free training with potential job placement through THCO
- Certificate upon completion

---

## Training Tracks

| Track | Target Audience | Status |
|-------|-----------------|--------|
| AI Engineer | Software Engineers | **Open Now** |
| AI Finance Professional | Finance Experts | Coming Soon |
| AI Marketer | Marketing Professionals | Coming Soon |
| AI Brand Architect | Brand Strategists | Coming Soon |
| AI Sales Professional | Sales Experts | Coming Soon |
| AI Business Analyst | Analysts | Coming Soon |

---

## User Roles & Personas

### 1. Applicant (Public)
- Visits landing page
- Submits application with resume
- Awaits AI screening and admin review

### 2. Student (Authenticated)
- Approved applicant with account
- Completes onboarding checklist
- Watches video modules
- Submits project assessments
- Earns certificate upon completion

### 3. Reviewer (Authenticated)
- Can review and grade submissions only
- Limited admin access

### 4. Admin (Authenticated)
- Reviews applications
- Runs AI screening
- Approves/rejects applicants
- Reviews submissions
- Manages content
- Views analytics

### 5. Super Admin (Authenticated)
- Full admin access
- Can manage user roles
- System configuration

---

## User Flows

### Flow 1: Application Process
```
Landing Page → Apply Now → Multi-Step Form → Upload Resume → Submit
                                                           ↓
                                              Application Stored in DB
                                                           ↓
                                              Admin Reviews (AI Screening)
                                                           ↓
                                              Approve / Reject
                                                           ↓
                                              Invitation Code Generated
                                                           ↓
                                              Email Sent (or manual share)
```

### Flow 2: Student Onboarding
```
Registration (with invitation code) → Onboarding Checklist
                                              ↓
                                    ☐ Code of Conduct
                                    ☐ How This Program Works
                                    ☐ Dev Environment Setup
                                    ☐ Join Community
                                    ☐ Confirm Commitment
                                              ↓
                                    All Complete → Dashboard Unlocked
```

### Flow 3: Learning Journey
```
Dashboard → Module 1 (Video + Resources)
                    ↓
           Submit Assessment
                    ↓
           Admin Reviews → Pass ✓ / Needs Work 🔄 / Fail ✗
                    ↓
           If Pass → Module 2 Unlocked
                    ↓
           ... Repeat for all modules ...
                    ↓
           All Modules Complete
                    ↓
           Generate Certificate (PDF)
```

---

## Features Specification

### Landing Page
- Hero section with headline and CTA
- "100% FREE" badge prominently displayed
- Training Tracks section (6 tracks with status)
- What You'll Learn (4 skill cards)
- Who This Is For (requirements list)
- How It Works (4-step process)
- About Day Learning (Thomas Day story)
- Final CTA section
- Footer with THCO branding

### Application Form
**Multi-step wizard with 3 steps:**

**Step 1: Personal Info**
- Full Name (required)
- Email (required)
- Phone (optional)
- LinkedIn URL (optional)

**Step 2: Experience**
- Years of Experience (dropdown: 1-2, 3-5, 6-10, 10+)
- Primary Skill Area (dropdown: Frontend, Backend, Full Stack, Mobile, DevOps, Data Engineering, Other)
- Resume Upload (PDF/DOCX) OR
- Text Brief about experience

**Step 3: Motivation**
- Why do you want to join? (textarea)
- Commitment checkbox (required)

### AI Application Screening
**Claude API Integration**

Analyzes:
- Form responses (experience, skills, motivation)
- Uploaded resume content (PDF/DOCX text extraction)
- Consistency between claims and resume
- Evidence of real projects/work

Returns:
- Decision: approve / reject / maybe
- Confidence score: 0-100%
- Reasoning
- Resume Analysis
- Consistency Check
- Strengths (list)
- Concerns (list)

### Admin Dashboard

**Overview Page**
- Total Applications count
- Active Students count
- Pending Reviews count
- Certificates Issued count
- Approval Rate %
- Onboarding Rate %
- Pass Rate %

**Applications Page**
- List all applications with status badges
- Download Resume button
- View full application details
- Run AI Screening button
- Approve / Reject buttons
- Invitation code display for approved

**Students Page**
- List enrolled students
- Progress tracking (X/4 modules)
- Onboarding status

**Submissions Page**
- List all project submissions
- Filter by status
- Review dialog with:
  - Pass / Needs Work / Fail options
  - Feedback textarea

**Content Page**
- List all modules
- Module details (title, description, order)
- Assessment status

**Analytics Page**
- Applications breakdown
- Students breakdown
- Submissions breakdown
- Certificates count

### Student Dashboard
- Current track display
- Overall progress bar
- Module list with status:
  - Locked 🔒
  - Available ▶️
  - In Progress 🔄
  - Completed ✓
- Recent submissions list
- Certificate generation (when complete)

### Module Page
- Module title and description
- "Assessment Required" badge
- Protected Video Player:
  - Watermark with student name/email
  - Blur on window focus loss
  - Right-click disabled
  - Screenshot detection
  - "Protected Content" indicator
- Resources section (external links)
- Assessment section:
  - Assessment prompt
  - Submit Project button
  - Submission status display
  - Admin feedback display
- Complete Module button (requires passed assessment)

### Certificate Generation
- PDF generated with ReportLab
- Contains:
  - Student name
  - Track name
  - Issue date
  - Certificate ID
  - Day Learning branding
- Downloadable from dashboard

---

## Database Schema

### Collections

**applications**
```javascript
{
  id: string (UUID),
  full_name: string,
  email: string,
  phone: string | null,
  linkedin_url: string | null,
  resume_url: string | null,
  brief: string | null,
  why_join: string,
  experience_years: string,
  skill_area: string,
  commitment: boolean,
  ai_screening_result: object | null,
  status: "pending_review" | "under_ai_review" | "ai_reviewed" | "approved" | "rejected",
  invitation_code: string | null,
  created_at: ISO datetime
}
```

**users**
```javascript
{
  id: string (UUID),
  email: string,
  password_hash: string,
  name: string,
  role: "student" | "reviewer" | "admin" | "super_admin",
  profile_photo: string | null,
  application_id: string | null,
  onboarding_completed: boolean,
  onboarding_items: {
    code_of_conduct: boolean,
    how_it_works: boolean,
    dev_environment: boolean,
    join_community: boolean,
    confirm_commitment: boolean
  },
  created_at: ISO datetime
}
```

**tracks**
```javascript
{
  id: string (UUID),
  name: string,
  description: string,
  icon: string,
  is_active: boolean,
  created_at: ISO datetime
}
```

**modules**
```javascript
{
  id: string (UUID),
  track_id: string,
  title: string,
  description: string,
  order: integer,
  video_url: string,
  resources: [{ title: string, url: string }],
  has_assessment: boolean,
  assessment_prompt: string | null,
  is_published: boolean,
  created_at: ISO datetime
}
```

**progress**
```javascript
{
  id: string (UUID),
  user_id: string,
  module_id: string,
  status: "locked" | "available" | "in_progress" | "completed",
  completed_at: ISO datetime | null
}
```

**submissions**
```javascript
{
  id: string (UUID),
  user_id: string,
  module_id: string,
  title: string,
  description: string,
  project_url: string,
  screenshots: [string],
  notes: string | null,
  status: "pending" | "pass" | "needs_work" | "fail",
  admin_feedback: string | null,
  reviewed_by: string | null,
  created_at: ISO datetime,
  reviewed_at: ISO datetime | null
}
```

**certificates**
```javascript
{
  id: string (UUID),
  user_id: string,
  track_id: string,
  issued_at: ISO datetime,
  certificate_url: string
}
```

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/tracks | List active tracks |
| GET | /api/modules | List published modules |
| POST | /api/applications | Submit application |

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Student (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/onboarding/status | Get onboarding status |
| PUT | /api/onboarding/item/{key} | Complete onboarding item |
| GET | /api/progress | Get module progress |
| POST | /api/progress/{module_id}/start | Start module |
| POST | /api/progress/{module_id}/complete | Complete module |
| GET | /api/submissions | Get my submissions |
| POST | /api/submissions | Submit project |
| POST | /api/certificates/generate | Generate certificate |
| GET | /api/certificates | Get my certificates |

### Admin (Authenticated + Admin Role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/applications | List all applications |
| GET | /api/applications/{id} | Get application details |
| POST | /api/applications/{id}/screen | Run AI screening |
| POST | /api/applications/{id}/approve | Approve application |
| POST | /api/applications/{id}/reject | Reject application |
| GET | /api/admin/students | List all students |
| GET | /api/admin/analytics | Get analytics |
| GET | /api/admin/users | List all users |
| PUT | /api/admin/users/{id}/role | Update user role |
| POST | /api/submissions/{id}/review | Review submission |

---

## Technical Stack

### Backend
- **Framework:** FastAPI (Python 3.11)
- **Database:** MongoDB
- **Authentication:** JWT with bcrypt
- **AI Integration:** Anthropic Claude API
- **Email:** Resend
- **PDF Generation:** ReportLab
- **File Parsing:** PyPDF2, python-docx

### Frontend
- **Framework:** React 19
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Animation:** Framer Motion
- **Routing:** React Router
- **HTTP Client:** Axios
- **Notifications:** Sonner (toast)

### Infrastructure
- **Hosting:** Emergent Platform
- **File Storage:** Local (uploads directory)
- **Database:** MongoDB (local)

---

## Security Features

### Authentication
- JWT tokens with 7-day expiry
- bcrypt password hashing
- Role-based access control

### Content Protection (Deterrents)
- Watermark overlay with student identity
- Video blur on window focus loss
- Right-click disabled
- Screenshot shortcut detection
- Screen capture API detection
- "Protected Content" indicator

**Note:** True DRM requires encrypted video at source. YouTube embeds cannot have hardware-level protection.

---

## Environment Variables

### Backend (/app/backend/.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=*
ANTHROPIC_API_KEY=sk-ant-api03-...
RESEND_API_KEY=re_...
SENDER_EMAIL=onboarding@resend.dev
JWT_SECRET=daylearning_jwt_secret_key_2024_thco
```

### Frontend (/app/frontend/.env)
```
REACT_APP_BACKEND_URL=https://your-app.preview.emergentagent.com
```

---

## Current Seed Data

### Admin User
- Email: joshua@thcohq.com
- Password: admin123
- Role: super_admin

### Test Student
- Email: ayo@thcohq.com
- Password: student123
- Role: student

### AI Engineer Track (4 Modules)

**Module 1: Introduction to AI-Powered Development**
- Understanding AI-first mindset
- Assessment: Reflection on AI-powered development

**Module 2: Prompt Engineering Fundamentals**
- Communicating with AI models
- Assessment: Build a prompt chain (GitHub repo)

**Module 3: Building Your First AI Application**
- From concept to working prototype
- Assessment: Build and deploy AI app (live link + repo)

**Module 4: Deployment & Production Readiness**
- Ship, monitor, maintain
- Assessment: Deploy with error handling and monitoring

---

## Pages Summary

| Page | URL | Access | Purpose |
|------|-----|--------|---------|
| Landing | / | Public | Attract and convert applicants |
| Apply | /apply | Public | Application form |
| Login | /login | Public | Authentication |
| Register | /register | Public | Account creation |
| Onboarding | /onboarding | Student | Pre-training checklist |
| Dashboard | /dashboard | Student | Training hub |
| Module | /module/:id | Student | Video + assessment |
| Admin Overview | /admin | Admin | Dashboard |
| Applications | /admin/applications | Admin | Review applicants |
| Students | /admin/students | Admin | Monitor progress |
| Submissions | /admin/submissions | Admin | Grade projects |
| Content | /admin/content | Admin | Manage modules |
| Analytics | /admin/analytics | Admin | Platform metrics |

---

## Known Limitations

1. **Email Delivery:** Using Resend test domain (onboarding@resend.dev) - only delivers to account owner. Need to verify custom domain for production.

2. **Video Protection:** YouTube embeds cannot have true DRM. Current measures are deterrents only.

3. **File Storage:** Using local storage. Consider cloud storage (S3) for production scale.

4. **Single Track:** Only AI Engineer track is active. Other tracks are placeholders.

---

## Future Roadmap

### Phase 2 (P1)
- [ ] Custom email domain setup
- [ ] Enhanced certificate design with THCO branding
- [ ] Full module CRUD in admin UI
- [ ] Student profile page with photo upload
- [ ] Email notifications for submission feedback
- [ ] Community integration (Discord/Slack links)

### Phase 3 (P2)
- [ ] Additional tracks (Finance, Marketing, Brand, Sales)
- [ ] Cohort/batch management
- [ ] In-app messaging
- [ ] Discussion forums
- [ ] LinkedIn certificate sharing
- [ ] Payment integration for premium tracks
- [ ] Advanced analytics with charts
- [ ] Mobile app (PWA)

---

## Support & Access

### URLs
- **Production:** https://skillforge-154.preview.emergentagent.com
- **Admin Login:** /login
- **Student Registration:** /register?code=XXXXXXXX

### Credentials
- **Admin:** joshua@thcohq.com / admin123
- **Test Student:** ayo@thcohq.com / student123

---

*Document maintained by THCO Development Team*
