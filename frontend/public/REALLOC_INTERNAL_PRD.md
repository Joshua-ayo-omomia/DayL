# Realloc Enterprise Dashboard — Internal PRD
## Technical Specification for Engineering & Product

---

## 1. Product Overview

**Product:** Realloc Enterprise Dashboard
**Version:** 1.0 (Demo-Ready)
**Last Updated:** March 2026
**Owner:** Product & Engineering
**Status:** Live (Pre-Seeded Data)

Realloc's Enterprise Dashboard is a B2B SaaS product that provides CIOs and CTOs with a real-time view of how AI is impacting their workforce, and what they can do about it. The dashboard aggregates assessment data from hundreds of employees, surfaces displacement risk patterns, tracks retraining program progress, and generates board-ready reports.

---

## 2. Architecture

### 2.1 Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React 18, Tailwind CSS, shadcn/ui | SPA with client-side routing |
| Animation | Framer Motion | Staggered reveals, progress bars, circular gauges |
| Charts | Recharts | ScatterChart, AreaChart, RadarChart |
| Backend | FastAPI (Python) | Monolithic, all endpoints in `server.py` |
| Database | MongoDB | Collections listed in Section 5 |
| Auth | JWT | Role-based: `super_admin`, `enterprise_admin`, `mentor`, `participant` |

### 2.2 File Structure

```
/app/backend/
  server.py          # All API endpoints, auth middleware, data models
  seed.py            # Database seeding (587 workers, 10 builder core, cohorts, curricula)
  requirements.txt
  .env               # MONGO_URL, DB_NAME

/app/frontend/src/
  pages/
    EnterpriseDashboard.js   # Main dashboard + sidebar component (exported)
    WorkforceHeatmap.js      # 587-worker scatter plot
    WorkerDiagnostic.js      # Individual worker deep-dive
    BuilderCore.js           # Top 10 candidates
    BoardReport.js           # PDF report generator
    CohortManagement.js      # Cohort listing and detail
    ParticipantDashboard.js  # Participant's personal view
    TaskPage.js              # Individual training task
    CommunityHub.js          # Discussion threads
    MyMentor.js              # Participant-mentor relationship
    LandingPage.js           # Public landing page
    AuthPages.js             # Login/registration
  context/
    AuthContext.js           # JWT management, API wrapper, role routing
  components/ui/             # shadcn/ui components
```

### 2.3 Routing

| Route | Component | Auth Required | Role |
|-------|-----------|--------------|------|
| `/` | LandingPage | No | — |
| `/login` | AuthPages | No | — |
| `/enterprise` | EnterpriseDashboard | Yes | `enterprise_admin`, `super_admin` |
| `/enterprise/heatmap` | WorkforceHeatmap | Yes | `enterprise_admin`, `super_admin` |
| `/enterprise/worker/:workerId` | WorkerDiagnostic | Yes | `enterprise_admin`, `super_admin` |
| `/enterprise/builder-core` | BuilderCore | Yes | `enterprise_admin`, `super_admin` |
| `/enterprise/report` | BoardReport | Yes | `enterprise_admin`, `super_admin` |
| `/enterprise/cohorts` | CohortManagement | Yes | `enterprise_admin`, `super_admin` |
| `/learn` | ParticipantDashboard | Yes | `participant` |
| `/learn/domain/:domainId/task/:taskId` | TaskPage | Yes | `participant` |
| `/community` | CommunityHub | Yes | Any authenticated |
| `/learn/mentor` | MyMentor | Yes | `participant` |

---

## 3. Design System

### 3.1 Color Palette

**CSS Variables (defined in `index.css` via `@layer base`):**

| Variable | HSL Value | Hex Equivalent | Usage |
|----------|----------|----------------|-------|
| `--background` | `0 0% 4%` | `#0A0A0A` | Page background |
| `--card` | `0 0% 7%` | `#121212` | Card/panel background |
| `--foreground` | `60 6% 93%` | `#EDEDE9` | Default text |
| `--border` | `0 0% 18%` | `#2E2E2E` | Borders, dividers |
| `--muted` | `0 0% 10%` | `#1A1A1A` | Muted backgrounds |
| `--primary` | `0 0% 100%` | `#FFFFFF` | Primary actions, CTAs |
| `--destructive` | `16 69% 50%` | `#D85A34` | Destructive actions |

**Semantic Colors (Tailwind classes):**

| Purpose | Tailwind Class | Hex | Opacity Variants |
|---------|---------------|-----|-----------------|
| Rising/Positive | `text-blue-400` | `#60A5FA` | `bg-blue-500/10`, `border-blue-500/20` |
| At Risk/Negative | `text-red-400` | `#F87171` | `bg-red-500/10`, `border-red-500/20` |
| Stable/Neutral | `text-gray-400` | `#9CA3AF` | `bg-gray-500/10`, `border-gray-500/20` |
| Success/Growth | `text-green-400` | `#4ADE80` | `bg-green-500/10`, `border-green-500/20` |
| Primary Text | `text-white` | `#FFFFFF` | — |
| Secondary Text | `text-gray-500` | `#6B7280` | — |
| Muted Text | `text-gray-600` | `#4B5563` | — |
| Card Border | `border-border/40` | `rgba(46,46,46,0.4)` | — |

**Color Rules:**
- Blue and Red are reserved exclusively for displacement-category data meaning
- Green is reserved for financial savings and skill growth
- White is the primary action/emphasis color (buttons, key metrics, headings)
- No decorative color. Everything communicates meaning.

### 3.2 Typography

| Font Family | Tailwind Class | Weight | Usage |
|-------------|---------------|--------|-------|
| Playfair Display | `font-display` | 700 (bold) | Page headings (`text-2xl`), dashboard title |
| Inter | `font-body` | 400, 600 | Section headers, body text, UI labels |
| JetBrains Mono | `font-mono` | 400 | Numerical data, percentages, scores, chart ticks |

**Text Hierarchy:**

| Element | Classes | Example |
|---------|---------|---------|
| Page Title | `text-2xl font-display font-bold text-white` | "Enterprise Dashboard" |
| Section Header | `text-sm font-semibold text-white font-body` | "Displacement Distribution" |
| Metric Value | `text-3xl font-bold text-[color]` | "234" (Rising count) |
| Metric Label | `text-xs text-gray-500` | "Workers Assessed" |
| Body Text | `text-sm text-gray-400` | Displacement interpretation |
| Annotation | `text-xs text-gray-600` | "Roles commoditizing..." |

### 3.3 Component Patterns

**Card Pattern:**
```html
<div className="bg-card border border-border/40 p-6">
  <h2 className="text-sm font-semibold text-white mb-4 font-body">Title</h2>
  <!-- content -->
</div>
```

**Stat Card Pattern:**
```html
<motion.div className="bg-card border border-border/40 p-5"
  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
  <Icon className="w-4 h-4 text-gray-600 mb-3" />
  <p className="text-2xl font-bold text-white">{value}</p>
  <p className="text-xs text-gray-500 mt-1">{label}</p>
</motion.div>
```

**Category Badge Pattern:**
```html
<span className={`text-xs px-1.5 py-0.5 ${
  cat === "rising" ? "text-blue-400 bg-blue-500/10" :
  cat === "at_risk" ? "text-red-400 bg-red-500/10" :
  "text-gray-400 bg-gray-500/10"
}`}>{cat}</span>
```

### 3.4 Animation System

| Animation | Library | Config | Where |
|-----------|---------|--------|-------|
| Card reveal | Framer Motion | `initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}` | All cards |
| Stagger delay | Framer Motion | `transition={{ delay: i * 0.05 }}` | Lists, grids |
| Progress bar | Framer Motion | `initial={{ width: 0 }} animate={{ width: "X%" }} transition={{ duration: 1 }}` | Upskilling tracker |
| Circular gauge | SVG + Framer | `strokeDasharray/strokeDashoffset` animation | AI Readiness Score |
| Row slide-in | Framer Motion | `initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}` | Upskilling rows |
| Pulse indicator | CSS | `animate-pulse` on green dot | "Real-time" badge |

---

## 4. API Endpoints

### 4.1 Enterprise Endpoints

**`GET /api/enterprise/{enterprise_id}/dashboard`**
- Auth: `enterprise_admin` or `super_admin`
- Returns: `enterprise`, `stats`, `displacement`, `builder_core_preview`, `active_cohort`, `cohorts`, `roi_data`, `risk_timeline`, `upskilling_progress`

Response shape:
```json
{
  "enterprise": { "id": "...", "name": "Sagicor Financial Company", "countries": [...] },
  "stats": {
    "total_workers": 587,
    "countries": 6,
    "active_cohorts": 1,
    "completion_rate": 100
  },
  "displacement": { "rising": 164, "stable": 199, "at_risk": 224 },
  "builder_core_preview": [ { "id": "...", "name": "...", "displacement_direction_score": 7.8 } ],
  "active_cohort": { "name": "...", "participant_ids": [...], "current_week": 0 },
  "roi_data": {
    "avg_salary": 85000,
    "retrain_cost_per_worker": 12000,
    "external_hire_cost": 145000,
    "workers_in_training": 14,
    "projected_annual_savings": 1862000,
    "cost_to_retrain": 168000,
    "cost_to_replace": 2030000,
    "business_outcomes": {
      "projected_hours_reclaimed_weekly": 120,
      "projected_speed_improvement_pct": 35
    }
  },
  "risk_timeline": [
    { "month": "Oct 2025", "at_risk_pct": 38, "stable_pct": 35, "rising_pct": 27 },
    { "month": "Nov 2025", "at_risk_pct": 35, "stable_pct": 37, "rising_pct": 28 },
    { "month": "Dec 2025", "at_risk_pct": 32, "stable_pct": 38, "rising_pct": 30 },
    { "month": "Jan 2026", "at_risk_pct": 29, "stable_pct": 39, "rising_pct": 32 },
    { "month": "Feb 2026", "at_risk_pct": 27, "stable_pct": 41, "rising_pct": 32 },
    { "month": "Mar 2026", "at_risk_pct": 24, "stable_pct": 42, "rising_pct": 34 }
  ],
  "upskilling_progress": [
    {
      "worker_id": "...", "name": "Anna Chen", "role_title": "Technical Lead",
      "department": "Application Modernization", "track_name": "AI-Powered App Modernization",
      "total_tasks": 16, "completed_tasks": 2, "completion_pct": 12,
      "current_domain": "AI-Augmented Architecture Design",
      "submissions": 4, "passed": 2, "displacement_category": "rising"
    }
  ]
}
```

**`GET /api/enterprise/{enterprise_id}/heatmap`**
- Auth: `enterprise_admin` or `super_admin`
- Query params: `country`, `department`, `category`
- Returns: `workers[]`, `summary`, `filters`

**`GET /api/enterprise/{enterprise_id}/workers/{worker_id}`**
- Auth: `enterprise_admin` or `super_admin`
- Returns: `worker` (includes `skill_dimensions`), `cohort`

**`GET /api/enterprise/{enterprise_id}/builder-core`**
- Auth: `enterprise_admin` or `super_admin`
- Returns: `candidates[]` (top 10 sorted by `mv_score`)

**`GET /api/enterprise/{enterprise_id}/report`**
- Auth: `enterprise_admin` or `super_admin`
- Returns: PDF blob

### 4.2 Participant Endpoints

**`GET /api/learn/dashboard`**
- Auth: `participant`
- Returns: `user`, `worker`, `domains`, `submissions`, `mentor`, `next_session`, `activity`, `ai_readiness`, `skill_dimensions`, `achievements`

Response shape (new fields):
```json
{
  "ai_readiness": 32,
  "skill_dimensions": {
    "ai_literacy": { "baseline": 2.1, "current": 3.4 },
    "data_analysis": { "baseline": 3.0, "current": 3.8 },
    "tool_proficiency": { "baseline": 1.9, "current": 2.7 },
    "strategic_thinking": { "baseline": 3.5, "current": 3.9 },
    "automation_design": { "baseline": 1.6, "current": 2.4 },
    "communication": { "baseline": 3.2, "current": 3.5 }
  },
  "achievements": [
    { "id": "first_task", "title": "First Task Complete", "icon": "check", "earned": true },
    { "id": "first_pass", "title": "First Mentor Approval", "icon": "star", "earned": true },
    { "id": "mentor_matched", "title": "Mentor Matched", "icon": "user", "earned": true },
    { "id": "domain_master", "title": "Domain Mastered", "icon": "award", "earned": false },
    { "id": "capstone", "title": "Capstone Submitted", "icon": "flag", "earned": false },
    { "id": "cohort_top3", "title": "Cohort Top 3", "icon": "trophy", "earned": false }
  ]
}
```

### 4.3 AI Readiness Score Calculation

```
ai_readiness = min(100,
    (completed_tasks / total_tasks) * 100 * 0.6    // 60% weight: task completion
  + (passed_submissions / total_submissions) * 100 * 0.3  // 30% weight: quality
  + (10 if has_mentor else 0)                       // 10% bonus: mentor matched
)
```

---

## 5. Data Model

### 5.1 Core Collections

**`workers`**
```json
{
  "id": "uuid",
  "enterprise_id": "uuid",
  "name": "string",
  "email": "string",
  "country": "string",
  "department": "string",
  "role_title": "string",
  "sa_score": 2.97,                    // Self-Assessment (1-5)
  "mv_score": 4.17,                    // Manager Validation (1-5)
  "displacement_direction_score": 7.8,  // 1-10 scale
  "displacement_category": "rising",    // "rising" | "stable" | "at_risk"
  "displacement_interpretation": "string",
  "builder_classification": "Core Builder",  // null for non-builders
  "humility_marker": "Humble",
  "manager_comment": "string",
  "task_decomposition": [
    { "task_name": "string", "ai_impact": "string", "direction": "string", "description": "string" }
  ],
  "skill_dimensions": {
    "ai_literacy": { "baseline": 2.1, "current": 3.4 },
    "data_analysis": { "baseline": 3.0, "current": 3.8 },
    "tool_proficiency": { "baseline": 1.9, "current": 2.7 },
    "strategic_thinking": { "baseline": 3.5, "current": 3.9 },
    "automation_design": { "baseline": 1.6, "current": 2.4 },
    "communication": { "baseline": 3.2, "current": 3.5 }
  },
  "cohort_id": "uuid|null",
  "created_at": "ISO8601"
}
```

**`skill_dimensions` generation logic:**
- `baseline` derived from `sa_score` with noise: `(sa_score/5) * 3.5 + random(-0.4, 0.4) + category_bonus`
- `current` for in-training workers: `baseline + random(0.3, 1.5) * (progress_pct / 100)`
- `current` for non-training workers: `= baseline`
- All values clamped to `[1.0, 5.0]`

**`enterprises`**
```json
{
  "id": "uuid",
  "name": "Sagicor Financial Company",
  "industry": "Financial Services",
  "countries": ["Jamaica", "Canada", ...],
  "total_employees": 587,
  "created_at": "ISO8601"
}
```

**`cohorts`**
```json
{
  "id": "uuid",
  "enterprise_id": "uuid",
  "name": "Cohort 1 - Builder Core",
  "status": "active",
  "participant_ids": ["uuid", ...],
  "mentor_ids": ["uuid", ...],
  "start_date": "2026-04-01",
  "end_date": "2026-07-31",
  "current_week": 0,
  "location": "Kingston, Jamaica",
  "business_outcomes": {
    "projected_hours_reclaimed_weekly": 120,
    "projected_speed_improvement_pct": 35
  }
}
```

**`domains`**
```json
{
  "id": "uuid",
  "participant_id": "uuid",
  "curriculum_id": "string",
  "title": "AI-Augmented Architecture Design",
  "description": "string",
  "weight_pct": 35,
  "order": 1,
  "why_assigned": "string",
  "task_count": 4
}
```

**`tasks`**
```json
{
  "id": "uuid",
  "domain_id": "uuid",
  "title": "AI Architecture Patterns for Legacy Systems",
  "description": "string",
  "order": 1,
  "video_url": "string",
  "video_presenter": "Marcus Thompson, Former Meta Engineering Lead",
  "resources": [{ "title": "string", "url": "string", "annotation": "string" }],
  "context_banner": "string",
  "practical_scenario": "string",
  "build_exercise": "string",
  "build_connection_to_capstone": "string",
  "is_published": true
}
```

**`progress`**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "task_id": "uuid",
  "domain_id": "uuid",
  "cohort_id": "uuid",
  "status": "completed|in_progress|available|locked",
  "completed_at": "ISO8601|null"
}
```

**`submissions`**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "task_id": "uuid",
  "domain_id": "uuid",
  "cohort_id": "uuid",
  "title": "string",
  "description": "string",
  "project_url": "string",
  "notes": "string",
  "status": "pass|needs_work|pending",
  "admin_feedback": "string|null",
  "reviewer_name": "string|null",
  "reviewer_credential": "string|null",
  "review_cycle": 1,
  "created_at": "ISO8601",
  "reviewed_at": "ISO8601|null"
}
```

### 5.2 Seed Data Summary

| Collection | Count | Notes |
|------------|-------|-------|
| workers | 587 | 10 real builder core + 577 synthetic |
| enterprises | 1 | Sagicor Financial Company |
| cohorts | 1 | Active, 14 participants |
| mentors | 3 | Marcus Thompson, Sarah Kim, David Okafor |
| domains | ~40 | 4 per builder core participant |
| tasks | ~160+ | 4 per domain |
| users | ~20 | Admin, enterprise admin, participants, mentors |
| submissions | 4 | For Anna Chen (pass, needs_work, pending, none) |

---

## 6. Chart & Visualization Specs

### 6.1 Workforce Heatmap (ScatterChart)

**Library:** Recharts `ScatterChart`
**Dimensions:** 100% width, 500px height
**Axes:**
- X: `displacement_direction_score` (0-10), label: "Displacement Direction Score"
- Y: `sa_score` (1-5), label: "Capability Score (SA)"

**Colors:**
- Rising: `#3B82F6` (blue-500) at 70% opacity
- Stable: `#6B7280` (gray-500) at 70% opacity
- At Risk: `#EF4444` (red-500) at 70% opacity

**Interaction:** Click → navigate to `/enterprise/worker/{id}`
**Grid:** Dashed, stroke `#1E1E1E`
**Tooltip:** Dark bg (`#card`), white text, shows name, role, department, score

### 6.2 Risk Reduction Trend (AreaChart)

**Library:** Recharts `AreaChart`
**Dimensions:** 100% width, 180px height
**Data:** 6 monthly snapshots (Oct 2025 – Mar 2026)

**Areas:**
| Series | Stroke | Fill Gradient | Data Key |
|--------|--------|--------------|----------|
| At Risk | `#EF4444` | `#EF4444` → transparent (top→bottom, 30%→0%) | `at_risk_pct` |
| Rising | `#3B82F6` | `#3B82F6` → transparent (top→bottom, 30%→0%) | `rising_pct` |

**Axes:** No axis lines, no tick lines. Tick text: `#4B5563`, 10px.
**Y Domain:** `[0, 50]`
**Tooltip:** Dark background `#1a1a2e`, white border at 10% opacity

### 6.3 Growth Radar (RadarChart)

**Library:** Recharts `RadarChart`
**Dimensions:** 100% width, 320px height
**Data:** 6 skill dimensions from `worker.skill_dimensions`

**Radar Layers:**
| Layer | Stroke | Fill | Opacity | Style |
|-------|--------|------|---------|-------|
| Assessment Baseline | `#6B7280` | `#6B7280` | 15% fill | Dashed (`strokeDasharray: "4 4"`) |
| Current | `#FFFFFF` | `#FFFFFF` | 10% fill | Solid, 2px width |

**Grid:** `rgba(255,255,255,0.06)`
**Angle Axis:** `#6B7280`, 11px
**Radius Domain:** `[0, 5]`

### 6.4 AI Readiness Score (Custom SVG)

**Type:** Animated circular progress
**Dimensions:** 128x128px (w-32 h-32)
**Implementation:** SVG `<circle>` with `strokeDasharray` and `strokeDashoffset` animated via Framer Motion

```
Circumference = 2 * PI * 42 = 263.89
Initial offset = 263.89 (0% filled)
Target offset = 263.89 * (1 - score/100)
```

**Animation:** `duration: 1.5s`, `delay: 0.5s`, `ease: "easeOut"`
**Ring:** White stroke, 6px width, rounded linecap
**Track:** `rgba(255,255,255,0.05)`, 6px width
**Center Number:** `text-3xl font-bold text-white font-mono`, fade-in at 0.8s delay

### 6.5 Skill Profile Radar (Participant)

Same as Growth Radar (6.3) but:
- Height: 220px (compact)
- Angle labels truncated to 4 chars per word (space constraint)
- No radius axis ticks
- Legend below chart (not inside)

### 6.6 Progress Bars (Upskilling Tracker)

**Track:** `h-1.5 bg-white/5 rounded-full`
**Fill:** `h-full bg-white rounded-full`
**Animation:** Framer Motion `width: 0 → X%`, `duration: 1s`, stagger `delay: 0.3 + i * 0.1`

---

## 7. Test Accounts

| Role | Email | Password | Enterprise ID | Route After Login |
|------|-------|----------|---------------|-------------------|
| Enterprise Admin | neil@sagicor.com | demo123 | (auto-resolved from user) | `/enterprise` |
| Participant | anna.chen@sagicor.com | demo123 | — | `/learn` |
| Participant | dennis.mcintosh@sagicor.com | demo123 | — | `/learn` |
| Mentor | marcus@realloc.ai | demo123 | — | `/mentor` |
| Super Admin | ayo@realloc.ai | admin123 | — | `/enterprise` |

---

## 8. Known Limitations (Current Version)

1. **Pre-seeded data only.** No real-time assessment ingestion pipeline. Data is seeded via `seed.py`.
2. **Risk timeline is static.** The 6-month trend is hardcoded in the API, not computed from actual historical snapshots.
3. **ROI assumptions hardcoded.** Retrain cost ($12K) and external hire cost ($145K) are constants, not configurable per enterprise.
4. **Mentor Dashboard UI not built.** Backend API exists but no frontend page at `/mentor`.
5. **Video placeholders.** All task videos show a "Recording scheduled" placeholder instead of actual video content.
6. **Single enterprise.** The platform currently supports only one enterprise (Sagicor). Multi-tenancy requires additional work.

---

## 9. Backlog

| ID | Feature | Priority | Status |
|----|---------|----------|--------|
| P3-01 | Mentor Dashboard UI | P3 | Backend ready, frontend needed |
| P3-02 | Interactive Cohort Builder | P3 | Not started |
| P3-03 | Department Aggregation Toggle (heatmap) | P3 | Not started |
| P3-04 | Full Dennis McIntosh curriculum (16 tasks) | P3 | Not started |
| P4-01 | Live Demo Mode (guided walkthrough) | P4 | Not started |
| P4-02 | Backend refactoring (split server.py) | P4 | Not started |
| P4-03 | What-If Simulator (drag workers, see ROI update) | P4 | Proposed |
| P4-04 | Configurable ROI parameters per enterprise | P4 | Not started |
| P4-05 | Real-time assessment ingestion | P4 | Not started |
