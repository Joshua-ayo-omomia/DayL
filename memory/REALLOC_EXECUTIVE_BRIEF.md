# Realloc Executive Dashboard
## Product Overview for Enterprise Stakeholders

---

### What is Realloc?

Realloc is a workforce intelligence platform that helps enterprise leaders understand how AI is reshaping their workforce — and act on it. It diagnoses which roles are rising and declining, identifies your top performers ("builders"), generates personalized training pathways, pairs employees with expert mentors, and produces board-ready reports.

**Tagline:** Diagnose. Reallocate. Equip.

---

## The Executive Dashboard

When you log in, the Executive Dashboard is your command center. It surfaces the five things every technology leader needs to answer at a glance:

1. **How large is the problem?**
2. **Where are we most exposed?**
3. **What's the financial case for action?**
4. **Who are my best candidates for retraining?**
5. **Is the program actually working?**

---

## Dashboard Sections

### 1. Top-Level Stats

Four summary cards give you an instant snapshot:

| Metric | What It Shows |
|--------|---------------|
| Workers Assessed | Total employees who have completed the Realloc Technology Capability Assessment |
| Countries | Number of countries represented in the workforce data |
| Active Cohorts | Training cohorts currently in progress |
| Assessment Completion | Percentage of invited employees who have completed their assessment |

---

### 2. Displacement Distribution

A three-panel breakdown of your entire assessed workforce into:

- **Rising** (Blue) — Roles that are specializing. AI removes their routine work, making their expertise *more* valuable. These employees are positioned well.
- **Stable** (Grey) — Displacement direction is unclear. These roles require monitoring — they could move in either direction depending on AI adoption speed.
- **At Risk** (Red) — Roles that are commoditizing. AI is automating the expertise these employees currently provide. Intervention is needed.

This gives you an honest, data-driven picture of organizational exposure. No spin. No averages hiding the tails.

---

### 3. ROI Projection

A side-by-side financial comparison showing the business case for retraining vs. replacement:

| Metric | Description |
|--------|-------------|
| **Cost to Retrain** | Number of workers in the current training cohort multiplied by cost per worker ($12,000). Shows the total investment required. |
| **Cost to Replace** | The same headcount multiplied by the average cost to externally recruit, hire, and onboard at the same level ($145,000). |
| **Projected Annual Savings** | The delta — what the organization saves by retraining internally instead of replacing externally. |
| **Hours Reclaimed / Week** | Projected productivity gains from AI-augmented workflows once training completes. |
| **Speed Improvement** | Estimated percentage improvement in team delivery speed. |

**Why this matters:** The savings figure gives you a number you can put in front of a board. It reframes upskilling from a "training cost" to a "cost avoidance strategy."

---

### 4. Risk Reduction Trend

An interactive area chart tracking two key metrics over a 6-month window:

- **At Risk %** (Red line, trending downward) — The percentage of the assessed workforce classified as at-risk. As the training program progresses, this line should decline.
- **Rising %** (Blue line, trending upward) — The percentage classified as rising. As employees gain new AI capabilities, more workers move into the rising category.

**How to read it:** The gap between the two lines is your progress. A widening gap means the program is working. A flat or converging trend signals intervention is needed.

**Data resolution:** Monthly snapshots from October 2025 onward.

---

### 5. Live Upskilling Progress

A real-time tracker showing every Builder Core member currently in training:

| Column | What It Shows |
|--------|---------------|
| **Name** | The employee, linked to their full individual diagnostic |
| **Displacement Category** | Color-coded badge — rising (blue), stable (grey), at risk (red) |
| **Track & Current Domain** | Their personalized training pathway name and the domain they're currently working through |
| **Progress Bar** | Animated bar showing tasks completed out of total tasks, with a percentage |
| **Passed** | Number of submissions that have been reviewed and approved by their assigned mentor |

**Why this matters:** This is the "mission control" view. You can see, in real time, which builders are progressing and which ones may need attention. No waiting for quarterly reports.

---

### 6. Builder Core Preview

A compact list of your top builder candidates ranked by their Manager Validation score. Each entry shows:

- Employee name, role, and country
- Their displacement direction score
- A clickable link to their full individual diagnostic

---

### 7. Active Cohort Summary

Shows the current active training cohort with:

- Cohort name
- Number of participants
- Current program week
- Location and start date
- Link to the full Cohort Management page

---

## Other Enterprise Pages

### Workforce Heatmap (`/enterprise/heatmap`)

A scatter plot visualization of your entire workforce (all 587 employees). Every dot is a person.

- **X-axis:** Displacement Direction Score (1–10). Higher = more specializing/rising.
- **Y-axis:** Self-Assessment Capability Score (1–5).
- **Dot color:** Blue (rising), Grey (stable), Red (at-risk).
- **Interaction:** Click any dot to see that employee's full diagnostic. Filter by country, department, or displacement category.

**Use case:** During a board presentation, this is your "this is the size of the challenge" visual. 587 dots make the problem tangible.

---

### Individual Worker Diagnostic (`/enterprise/worker/:id`)

The deepest view of a single employee. Includes:

- **Profile header** with name, role, department, country, and builder classification
- **Score summary:** Self-Assessment, Manager Validation, and Displacement Direction scores
- **Displacement Gauge:** A gradient bar from "Commoditizing" to "Specializing" with a position marker
- **Growth Radar (Before vs Now):** A 6-dimension spider chart comparing the employee's assessment baseline to their current skill level across:
  - AI Literacy
  - Data Analysis
  - Tool Proficiency
  - Strategic Thinking
  - Automation Design
  - Communication
- **Skill Growth Deltas:** A grid showing the numerical improvement in each dimension (in green)
- **Role Task Analysis:** A table decomposing the employee's role into individual tasks, showing the AI impact level and displacement direction for each task

**Use case:** When a board member asks, "Show me one specific person," this is the page you pull up. It tells a complete story: where they were, where they are, and where they're going.

---

### Builder Core (`/enterprise/builder-core`)

A ranked list of your top 10 builder candidates — the people best positioned for retraining. For each:

- Rank, name, role, department, country
- Manager classification (e.g., "Core Builder", "Emerging Builder") and humility badge
- Self-Assessment and Manager Validation score bars
- Manager's qualitative commentary
- Link to full diagnostic

---

### Board Report (`/enterprise/report`)

Generates a PDF board report containing:

- Executive summary with key statistics
- Displacement distribution breakdown
- Cohort status and builder core highlights
- ROI analysis
- Program recommendations

Designed to be downloaded and presented directly to a board of directors without additional formatting.

---

### Cohort Management (`/enterprise/cohorts`)

View and manage training cohorts:

- List of all cohorts with status (active/planned/completed)
- Participant count and current week
- Click into a cohort for detailed participant-level data
- Timeline and business outcomes for each cohort

---

## Visual Design Language

### Color System

The platform uses a dark-mode-first design with strategic color coding:

| Element | Color | Hex/Code | Usage |
|---------|-------|----------|-------|
| Background | Near-black | `hsl(0, 0%, 4%)` | Page background |
| Card | Dark grey | `hsl(0, 0%, 7%)` | All panels, cards, sections |
| Primary text | White | `#FFFFFF` | Headings, key numbers, interactive elements |
| Secondary text | Grey-500 | `#6B7280` | Labels, descriptions |
| Muted text | Grey-600 | `#4B5563` | Annotations, timestamps |
| Rising / Positive | Blue-400 | `#3B82F6` | Rising displacement, positive trends |
| At Risk / Negative | Red-400 | `#EF4444` | At-risk displacement, warnings |
| Stable / Neutral | Grey-400 | `#9CA3AF` | Stable states, neutral indicators |
| Success / Savings | Green-400 | `#4ADE80` | Cost savings, approvals, growth deltas |
| Borders | White at 10-40% | `rgba(255,255,255,0.1-0.4)` | Subtle panel separation |

**Design philosophy:** Minimal color. White, grey, black — with blue and red reserved exclusively for data meaning. No decorative color.

### Typography

- **Headings:** Playfair Display (serif) — conveys authority
- **Body/UI:** Inter (sans-serif) — clean, professional readability
- **Numbers/Data:** JetBrains Mono (monospace) — precision and clarity

### Charts & Visualizations

| Chart | Library | Type | Where Used |
|-------|---------|------|------------|
| Risk Reduction Trend | Recharts | AreaChart | Enterprise Dashboard |
| Workforce Heatmap | Recharts | ScatterChart | Heatmap page |
| Growth Radar | Recharts | RadarChart | Worker Diagnostic |
| AI Readiness Score | Custom SVG | Circular Progress | Participant Dashboard |
| Skill Profile | Recharts | RadarChart | Participant Dashboard |
| Progress Bars | Framer Motion | Animated divs | Upskilling Tracker |

### Animation

- All cards and sections use staggered fade-in-up animations on load
- Progress bars animate from 0 to their target width with easing
- The AI Readiness Score ring animates its stroke with a 1.5s ease-out
- Hover states on interactive elements provide immediate visual feedback

---

## Access & Authentication

| Role | Email | Access Level |
|------|-------|-------------|
| Enterprise Admin | neil@sagicor.com | Full enterprise dashboard, heatmap, builder core, reports, cohort management |
| Participant | anna.chen@sagicor.com | Personal dashboard, training tasks, mentor, community |
| Mentor | marcus@realloc.ai | Submission review, cohort oversight |
| Super Admin | ayo@realloc.ai | Full platform administration |

---

*Prepared by Realloc Product Team*
*Platform Version: March 2026*
