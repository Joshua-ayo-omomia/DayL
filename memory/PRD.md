# Realloc — Product Requirements Document

## Overview
Realloc is an AI workforce reallocation platform for enterprise clients. It diagnoses which roles are rising and declining due to AI, identifies top performers ("builders"), generates personalized training paths from assessment data, assigns expert mentors, and produces board-ready reports.

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
enterprises, workers, cohorts, mentors, domains, tasks, submissions, business_cases, discussion_threads, users

## Seed Data
587 synthetic workers + 10 real "Builder Core" candidates for Sagicor Financial demo. Seeded via `/app/backend/seed.py`.

## Demo Credentials
- Enterprise Admin: `neil@sagicor.com` / `demo123`
- Participant: `anna.chen@sagicor.com` / `demo123`
- Mentor: `marcus@realloc.ai` / `demo123`
- Super Admin: `ayo@realloc.ai` / `admin123`

## What's Been Implemented
- Full backend rewrite with all API endpoints
- Full frontend rewrite with all pages listed above
- Database seeding with 587 workers and all associated data
- Futuristic animated landing page (no client name exposed, platform-level stats)
- Mentor connection flow on landing page and participant dashboard
- Tested: 26/26 backend tests passed, all frontend flows verified

## Backlog
| Task | Priority |
|------|----------|
| Mentor Dashboard UI (`/mentor`) | P3 |
| Interactive Cohort Builder | P3 |
| Department Aggregation Toggle (heatmap) | P3 |
| Full curriculum for Dennis McIntosh (16 tasks) | P3 |
| Live Demo Mode (guided walkthrough overlay) | P4 |
| Backend refactoring (split server.py) | P4 |
