# Realloc — Product Requirements Document

## Overview
Realloc is an AI workforce reallocation platform for enterprise clients. It diagnoses which roles are rising and declining due to AI, identifies top performers ("builders"), generates personalized training paths, assigns expert mentors, and produces board-ready reports.

## Target Users
- **Enterprise Admins** (e.g., CTO/CIO) — view dashboards, heatmaps, builder core, board reports
- **Participants** (workers in program) — personal diagnostic, training tasks, mentor interaction
- **Mentors** — manage assigned participants, review submissions
- **Super Admins** — platform-level management

## Tech Stack
- **Frontend**: React, Tailwind CSS, shadcn/ui, Framer Motion, Recharts
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Auth**: JWT with roles (super_admin, enterprise_admin, mentor, participant)

## Core Pages (All Implemented)
| Page | Route | Status |
|------|-------|--------|
| Landing Page | `/` | Done |
| Auth (Login) | `/login` | Done |
| Enterprise Dashboard | `/enterprise` | Done |
| Workforce Heatmap | `/enterprise/heatmap` | Done |
| Worker Diagnostic | `/enterprise/worker/:id` | Done |
| Builder Core | `/enterprise/builder-core` | Done |
| Board Report | `/enterprise/report` | Done |
| Cohort Management | `/enterprise/cohorts` | Done |
| Participant Dashboard | `/learn` | Done |
| Task Page | `/learn/domain/:domainId/task/:taskId` | Done |
| Community Hub | `/community` | Done |
| My Mentor | `/learn/mentor` | Done |

## Database Collections
enterprises, workers, cohorts, mentors, domains, tasks, submissions, business_cases, discussion_threads, users, progress

## Seed Data
587 synthetic workers + 10 real "Builder Core" candidates with skill_dimensions and training curricula. Seeded via `/app/backend/seed.py`.

## Demo Credentials
- Enterprise Admin: `neil@sagicor.com` / `demo123`
- Participant: `anna.chen@sagicor.com` / `demo123`
- Mentor: `marcus@realloc.ai` / `demo123`
- Super Admin: `ayo@realloc.ai` / `admin123`

## What's Been Implemented

### Core Platform (P1/P2)
- Full backend rewrite with all API endpoints
- Full frontend rewrite with all pages
- Database seeding with 587 workers and all associated data
- Futuristic animated landing page (platform-level stats: 12,400+)
- Mentor connection flow on landing and participant dashboard
- 26/26 backend tests passed

### Mind-Blowing Demo Features (Latest)
1. **ROI Projection Panel** — Enterprise dashboard shows cost-to-retrain vs cost-to-replace with projected annual savings
2. **Risk Reduction Timeline** — Area chart showing At Risk % trending down and Rising % trending up over 6 months
3. **Live Upskilling Progress Tracker** — Real-time view of 9 builder core members with progress bars, current domain, completion %
4. **Growth Radar (Before vs Now)** — Spider/radar chart on worker diagnostic showing baseline assessment vs current skill dimensions with green growth deltas
5. **AI Readiness Score** — Animated circular score on participant dashboard computed from task completion + submission quality
6. **Skill Profile Radar** — 6-dimension spider chart on participant dashboard (AI Literacy, Data Analysis, Tool Proficiency, Strategic Thinking, Automation Design, Communication)
7. **Achievement Milestones** — Gamified milestone system (First Task, Mentor Approval, Mentor Matched, Domain Mastered, Capstone, Cohort Top 3)
8. **Video Placeholder** — Replaced Rick Astley embed with professional "Recording scheduled" placeholder

## Backlog
| Task | Priority |
|------|----------|
| Mentor Dashboard UI (`/mentor`) | P3 |
| Interactive Cohort Builder | P3 |
| Department Aggregation Toggle (heatmap) | P3 |
| Full curriculum for Dennis McIntosh (16 tasks) | P3 |
| Live Demo Mode (guided walkthrough overlay) | P4 |
| Backend refactoring (split server.py) | P4 |
