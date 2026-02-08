# Day Learning - Product Requirements Document

## Overview
Day Learning is an AI upskilling platform by THCO (Talentco Holding Company). It trains professionals who already have experience to become AI-powered engineers. Named after Thomas Day, a Black furniture maker whose exceptional craftsmanship set the standard we aspire to.

**Tagline:** "Learn AI. Work On Real Things. Get Hired."

## Original Problem Statement
Build a complete AI upskilling platform with:
- Landing page with application flow
- AI-powered screening using Claude API
- Student onboarding and training dashboard
- Video-based modules with assessments
- Project submission and grading system
- Certificate generation
- Admin dashboard for managing applications, students, and content

## User Personas

### 1. Applicant
- Software engineer with 1+ years experience
- Wants to transition into AI engineering
- Looking for structured learning with real projects

### 2. Student (Enrolled Learner)
- Approved applicant who has created an account
- Goes through onboarding, completes modules, submits projects
- Earns certificate upon completion

### 3. Admin / Super Admin
- THCO team member reviewing applications
- Uses AI screening to evaluate candidates
- Reviews and grades project submissions
- Manages content and monitors analytics

### 4. Reviewer
- Can review and grade submissions only
- Limited admin access

## Core Requirements (Static)

### Public Pages
- Landing page with hero, features, how it works, about sections
- Application form (multi-step wizard)
- Login/Register pages

### Student Features
- Onboarding checklist (5 items to complete)
- Training dashboard with progress tracking
- Module view with video player and resources
- Project submission for assessments
- Certificate generation on completion

### Admin Features
- Overview dashboard with analytics
- Applications management with AI screening (Claude API)
- Students management with progress tracking
- Submissions review with pass/fail/needs_work grading
- Content management (modules)
- Analytics dashboard

## What's Been Implemented (MVP - Phase 1) ✅

### Backend (FastAPI + MongoDB)
- [x] JWT-based authentication with role-based access control
- [x] Application submission with resume upload (local storage)
- [x] AI screening integration using Claude API (Anthropic)
- [x] Application approval/rejection with invitation code generation
- [x] Email notifications via Resend (approval/rejection emails)
- [x] Track and module management with seed data
- [x] Student progress tracking
- [x] Project submission system
- [x] Submission review (pass/needs_work/fail)
- [x] Certificate PDF generation using ReportLab
- [x] Admin analytics endpoints

### Frontend (React + Tailwind + shadcn/ui)
- [x] Landing page with all required sections
- [x] Multi-step application form with validation
- [x] Login and registration pages
- [x] Student onboarding checklist
- [x] Student dashboard with module progress
- [x] Module view with embedded YouTube videos
- [x] Project submission dialog
- [x] Admin layout with sidebar navigation
- [x] Admin applications page with AI screening
- [x] Admin students page
- [x] Admin submissions page with review dialog
- [x] Admin content management page
- [x] Admin analytics page

### Integrations
- [x] Anthropic Claude API for AI screening
- [x] Resend for transactional emails
- [x] MongoDB for database
- [x] JWT for authentication

## Seeded Data
- 1 Track: AI Engineer
- 4 Modules:
  1. Introduction to AI-Powered Development
  2. Prompt Engineering Fundamentals (with assessment)
  3. Building Your First AI Application (with assessment)
  4. Deployment & Production Readiness (with assessment)
- 1 Super Admin: admin@daylearning.com / admin123

## Database Collections
- applications
- users
- tracks
- modules
- progress
- submissions
- certificates

## Prioritized Backlog (P0/P1/P2)

### P0 - Critical (Done in MVP)
- ✅ Landing page
- ✅ Application submission
- ✅ Admin application review with AI screening
- ✅ Student onboarding
- ✅ Training modules view
- ✅ Project submission
- ✅ Basic certificate generation

### P1 - Important (Next Phase)
- [ ] Improve certificate design with THCO branding
- [ ] Email templates with better design
- [ ] Admin ability to edit modules (full CRUD UI)
- [ ] Student profile page with photo upload
- [ ] Community links integration (Discord/Slack)
- [ ] Module completion notifications
- [ ] Submission feedback email notifications

### P2 - Nice to Have (Future)
- [ ] Multiple tracks support (AI Marketer, AI Designer, etc.)
- [ ] Pod/cohort management
- [ ] In-app messaging
- [ ] Discussion forums
- [ ] LinkedIn certificate sharing
- [ ] Payment integration for future paid tracks
- [ ] Advanced analytics with charts
- [ ] Dark/Light theme toggle
- [ ] PWA support for mobile

## Technical Stack
- **Backend:** FastAPI, Python 3.11
- **Database:** MongoDB
- **Frontend:** React 19, Tailwind CSS, shadcn/ui
- **Auth:** JWT with bcrypt
- **AI:** Anthropic Claude API
- **Email:** Resend
- **File Storage:** Local (uploads directory)
- **PDF:** ReportLab

## Environment Variables
```
# Backend (.env)
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=*
ANTHROPIC_API_KEY=sk-ant-api03-...
RESEND_API_KEY=re_...
SENDER_EMAIL=onboarding@resend.dev
JWT_SECRET=daylearning_jwt_secret_key_2024_thco

# Frontend (.env)
REACT_APP_BACKEND_URL=https://your-app.preview.emergentagent.com
```

## Next Action Items
1. Test the full user flow end-to-end (apply → approve → onboard → learn → submit → certificate)
2. Configure Resend domain for production emails
3. Add more detailed module content (real YouTube videos)
4. Improve certificate design
5. Add student profile management
6. Implement submission feedback notifications

---
*Last Updated: February 2026*
*Version: 1.0 MVP*
