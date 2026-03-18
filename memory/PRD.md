# Realloc - AI Workforce Reallocation Platform

## Overview
Realloc is an enterprise workforce reallocation platform that diagnoses AI displacement at the task level, identifies top talent ("builder core"), builds personalized training cohorts, and generates board-ready reports. Currently deployed for Sagicor Financial Company ($200K contract, 587 workers, 6 countries).

## Core Requirements
- **Enterprise Dashboard**: Top-level stats (587 workers, 6 countries, displacement distribution)
- **Workforce Heatmap**: Scatter plot of all workers by displacement direction vs capability
- **Worker Diagnostic**: Individual profile with task decomposition, displacement gauge, pathway recommendation
- **Builder Core**: Top 10 candidates ranked by manager validation and self-awareness
- **Participant Dashboard**: Personal diagnostic + personalized 4-domain training program
- **Task Page**: Video, resources, practical scenario, build exercise, mentor feedback, discussion
- **Board Report**: PDF generation with executive summary, charts, cohort plans, projections
- **Community Hub**: Expert mentor profiles (Meta, NVIDIA, OpenAI), discussions, activity feed
- **My Mentor**: Session schedule, review history
- **Cohort Management**: 4 cohorts (1 active, 3 planned)

## Tech Stack
- **Backend**: FastAPI (Python), MongoDB
- **Frontend**: React, Tailwind CSS, shadcn/ui, Framer Motion, Recharts
- **Auth**: JWT-based with roles: super_admin, enterprise_admin, participant, mentor
- **PDF**: ReportLab

## Seed Data
- 587 workers (Jamaica 280, Canada 180, USA 50, T&T 35, Barbados 25, Curacao 17)
- 10 real Builder Core candidates with actual assessment data
- 3 mentors (Marcus Thompson/Meta, David Okafor/NVIDIA, Sarah Kim/OpenAI)
- Cohort 1: 12 participants, Active, Barbados, April-June 2026
- Full curricula for Anna Chen and Dennis McIntosh (16 tasks each)
- 8 submissions with mentor feedback (pass, needs_work, pending)
- 5 discussion threads with mentor and peer responses
- 6 mentor sessions, 15 activity feed entries, role-based notifications

## Demo Accounts
| Email | Password | Role |
|-------|----------|------|
| ayo@realloc.ai | admin123 | super_admin |
| neil@sagicor.com | demo123 | enterprise_admin |
| anna.chen@sagicor.com | demo123 | participant |
| dennis.mcintosh@sagicor.com | demo123 | participant |
| marcus@realloc.ai | demo123 | mentor |

## Completed (Phase 1-3, P1+P2)
- [x] Full branding: Realloc name, white/grey accents, dark theme, no teal
- [x] Backend: 30+ API endpoints for enterprise, learn, community, notifications, report
- [x] Seed data: 587 workers, 10 builder core, 3 mentors, all demo data
- [x] Enterprise Dashboard with stat cards and displacement distribution
- [x] Workforce Heatmap with scatter plot, filters (country/department/category)
- [x] Individual Worker Diagnostic with scores, gauge, task decomposition, pathway
- [x] Builder Core with scatter plot and ranked candidate cards
- [x] Board Report with preview and PDF download
- [x] Cohort Management (4 cohorts)
- [x] Participant Dashboard with diagnostic summary and personalized domains
- [x] Task Page with context banner, video, resources, scenario, exercise, feedback
- [x] Community Hub with mentor profiles and discussions
- [x] My Mentor page with session schedule and review history
- [x] Notification bell for enterprise and participant roles
- [x] Activity feed
- [x] All 26/26 backend tests passing, all frontend tests passing

## Backlog (P3)
- [ ] Mentor Dashboard (/mentor) for submission review
- [ ] Capstone Business Case page (/learn/capstone) 
- [ ] Department aggregation toggle on heatmap
- [ ] Interactive cohort builder
- [ ] Curriculum generation animation
- [ ] Full second curriculum content for Dennis McIntosh
- [ ] My Diagnostic page (/learn/diagnostic) separate from dashboard
- [ ] Cohort Detail page (/enterprise/cohorts/:id) with participant list
- [ ] Replace placeholder YouTube videos with actual practitioner briefings

## Architecture
```
/app/
├── backend/
│   ├── server.py          # FastAPI app with all routes
│   ├── seed.py            # Seed data generation (587 workers + all demo data)
│   ├── requirements.txt
│   ├── .env
│   └── tests/
│       └── test_realloc_api.py
├── frontend/
│   ├── src/
│   │   ├── App.js                    # Routing
│   │   ├── context/AuthContext.js     # Auth with role management
│   │   ├── pages/
│   │   │   ├── LandingPage.js
│   │   │   ├── AuthPages.js
│   │   │   ├── EnterpriseDashboard.js
│   │   │   ├── WorkforceHeatmap.js
│   │   │   ├── WorkerDiagnostic.js
│   │   │   ├── BuilderCore.js
│   │   │   ├── BoardReport.js
│   │   │   ├── CohortManagement.js
│   │   │   ├── ParticipantDashboard.js
│   │   │   ├── TaskPage.js
│   │   │   ├── CommunityHub.js
│   │   │   └── MyMentor.js
│   │   └── components/ui/       # shadcn components
│   └── package.json
└── memory/
    └── PRD.md
```
