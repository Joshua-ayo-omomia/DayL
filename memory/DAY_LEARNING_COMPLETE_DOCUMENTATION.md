# Day Learning Platform
## Complete Technical & Product Documentation

---

# TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Brand & Identity](#2-brand--identity)
3. [Platform Overview](#3-platform-overview)
4. [User Roles & Permissions](#4-user-roles--permissions)
5. [Complete User Flows](#5-complete-user-flows)
6. [Feature Specifications](#6-feature-specifications)
7. [Page-by-Page Breakdown](#7-page-by-page-breakdown)
8. [Database Architecture](#8-database-architecture)
9. [API Documentation](#9-api-documentation)
10. [Technical Stack](#10-technical-stack)
11. [Security Implementation](#11-security-implementation)
12. [Third-Party Integrations](#12-third-party-integrations)
13. [File Structure](#13-file-structure)
14. [Environment Configuration](#14-environment-configuration)
15. [Deployment Information](#15-deployment-information)
16. [Current Data & Credentials](#16-current-data--credentials)
17. [Known Limitations](#17-known-limitations)
18. [Future Roadmap](#18-future-roadmap)

---

# 1. EXECUTIVE SUMMARY

## What is Day Learning?

Day Learning is a comprehensive AI upskilling platform designed to transform experienced professionals into AI-powered experts. Unlike traditional coding bootcamps that teach from scratch, Day Learning targets professionals who already have domain expertise and teaches them to leverage AI in their existing work.

## The Vision

Named after **Thomas Day**, a 19th-century furniture maker whose craftsmanship was so exceptional he became the largest employer of labor in North Carolina, Day Learning embodies the principle that excellence is undeniable. The platform aims to produce graduates whose AI skills make them "the first call, not the backup option."

## Key Value Propositions

1. **For Experienced Professionals Only** - Minimum 1 year of professional experience required
2. **Project-Based Learning** - Every module requires building something real
3. **AI-Powered Screening** - Claude AI evaluates all applications for quality
4. **Completely Free** - No cost to learners; THCO invests in talent
5. **Job Placement Potential** - Top performers may be placed through THCO's network
6. **Multi-Track Platform** - Serving engineers, marketers, finance, sales, and brand professionals

## Current Status

- **Version:** 1.0 MVP
- **Active Track:** AI Engineer
- **Modules:** 4 (all with required assessments)
- **Platform Status:** Fully functional

---

# 2. BRAND & IDENTITY

## Brand Story

Day Learning is named after **Thomas Day** (1801-1861), a 19th-century furniture maker whose craftsmanship was so exceptional he became the largest employer of labor in North Carolina. His work wasn't just good—it was undeniable. Clients traveled from across the state because no one else built at his level.

That standard is what we want our graduates to carry. We don't just teach AI. We train people to build with the kind of excellence that stands out, the kind that makes you the first call, not the backup option.

## Brand Guidelines

### Colors
| Color | Hex Code | Usage |
|-------|----------|-------|
| Teal (Primary) | #2A9D8F | CTAs, highlights, success states |
| Amber (Secondary) | #E9C46A | Warnings, accents, certificates |
| Coral | #E76F51 | Errors, destructive actions |
| Navy | #264653 | Secondary backgrounds |
| Background | #0A0A0A | Main background |
| Foreground | #EDEDE9 | Primary text |
| Muted | #A6A6A6 | Secondary text |
| Card | #121212 | Card backgrounds |
| Border | #2E2E2E | Borders, dividers |

### Typography
| Element | Font | Weight |
|---------|------|--------|
| Headings | Playfair Display | 600-700 |
| Body | Inter | 400-500 |
| Code/Mono | JetBrains Mono | 400-500 |

### Voice & Tone
- **Professional but warm** - Not corporate, not bootcamp-bro
- **Confident** - We know what we're doing
- **Encouraging** - "Smart mentor who believes in you"
- **Direct** - No fluff, no filler
- **Quality-focused** - Excellence is the expectation

### Tagline
> "Learn AI. Work On Real Things. Get Hired."

### Logo
Text-based logo: "Day Learning" with the "D" in a teal rounded square. Subtle spiral motif optional.

---

# 3. PLATFORM OVERVIEW

## Training Tracks

| Track | Target Audience | Status | Description |
|-------|-----------------|--------|-------------|
| **AI Engineer** | Software Engineers | ✅ Open Now | Build AI-powered applications, master prompt engineering, deploy production-ready AI solutions |
| **AI Finance Professional** | Finance Experts | 🔜 Coming Soon | AI for financial analysis, automated reporting, risk assessment, data-driven decisions |
| **AI Marketer** | Marketing Professionals | 🔜 Coming Soon | AI-powered campaigns, automated content creation, marketing optimization |
| **AI Brand Architect** | Brand Strategists | 🔜 Coming Soon | AI for brand development, visual content creation, brand identity at scale |
| **AI Sales Professional** | Sales Experts | 🔜 Coming Soon | AI-enhanced sales processes, lead scoring, personalized outreach, behavior prediction |
| **AI Business Analyst** | Analysts | 🔜 Coming Soon | Transform data into insights, automate reporting, drive strategic decisions |

## AI Engineer Track - Module Breakdown

### Module 1: Introduction to AI-Powered Development
- **Objective:** Understand what it means to build with AI, not just use it
- **Content:** Video lesson on AI-first mindset
- **Resources:** 2 external articles
- **Assessment:** Write a reflection on AI-powered development and provide one example of a problem you could solve with AI
- **Deliverable:** Document or GitHub gist

### Module 2: Prompt Engineering Fundamentals
- **Objective:** Learn to communicate with AI models effectively for production-quality output
- **Content:** Video lesson on prompt engineering techniques
- **Resources:** 2 external guides
- **Assessment:** Build a prompt chain that takes a user requirement and generates working code
- **Deliverable:** GitHub repository

### Module 3: Building Your First AI Application
- **Objective:** Build a real application powered by AI from concept to prototype
- **Content:** Video lesson on AI app architecture and integration
- **Resources:** 2 external articles
- **Assessment:** Build and deploy a working AI-powered application
- **Deliverable:** Live link + GitHub repository

### Module 4: Deployment & Production Readiness
- **Objective:** Ship, monitor, and maintain AI applications in production
- **Content:** Video lesson on deployment and monitoring
- **Resources:** 2 external guides
- **Assessment:** Deploy Module 3 project with proper error handling and monitoring
- **Deliverable:** Production URL with monitoring

---

# 4. USER ROLES & PERMISSIONS

## Role Hierarchy

```
Super Admin
    ↓
  Admin
    ↓
 Reviewer
    ↓
 Student
    ↓
 Applicant (unauthenticated)
```

## Detailed Permissions Matrix

| Permission | Applicant | Student | Reviewer | Admin | Super Admin |
|------------|-----------|---------|----------|-------|-------------|
| View landing page | ✅ | ✅ | ✅ | ✅ | ✅ |
| Submit application | ✅ | ❌ | ❌ | ❌ | ❌ |
| Login | ❌ | ✅ | ✅ | ✅ | ✅ |
| View own dashboard | ❌ | ✅ | ❌ | ❌ | ❌ |
| Complete onboarding | ❌ | ✅ | ❌ | ❌ | ❌ |
| View modules | ❌ | ✅ | ❌ | ✅ | ✅ |
| Submit assessments | ❌ | ✅ | ❌ | ❌ | ❌ |
| Generate certificate | ❌ | ✅ | ❌ | ❌ | ❌ |
| Review submissions | ❌ | ❌ | ✅ | ✅ | ✅ |
| View applications | ❌ | ❌ | ❌ | ✅ | ✅ |
| Run AI screening | ❌ | ❌ | ❌ | ✅ | ✅ |
| Approve/reject apps | ❌ | ❌ | ❌ | ✅ | ✅ |
| View all students | ❌ | ❌ | ❌ | ✅ | ✅ |
| View analytics | ❌ | ❌ | ❌ | ✅ | ✅ |
| Manage content | ❌ | ❌ | ❌ | ✅ | ✅ |
| Manage user roles | ❌ | ❌ | ❌ | ❌ | ✅ |

## User Lifecycle

### Applicant → Student Journey
```
1. Visits landing page
2. Clicks "Apply Now"
3. Completes 3-step application form
4. Uploads resume (PDF/DOCX) or writes brief
5. Submits application
6. Receives confirmation
7. Waits for review (up to 48 hours)
8. [ADMIN] Reviews application
9. [ADMIN] Runs AI screening
10. [ADMIN] Approves application
11. Receives invitation code (email or manual share)
12. Registers account with invitation code
13. Completes 5-step onboarding
14. Accesses student dashboard
15. Begins learning journey
```

---

# 5. COMPLETE USER FLOWS

## Flow 1: Application Submission

```
┌─────────────────┐
│  Landing Page   │
│    (Public)     │
└────────┬────────┘
         │ Click "Apply Now"
         ▼
┌─────────────────┐
│  Application    │
│   Step 1/3      │
│ - Full Name*    │
│ - Email*        │
│ - Phone         │
│ - LinkedIn URL  │
└────────┬────────┘
         │ Click "Next"
         ▼
┌─────────────────┐
│  Application    │
│   Step 2/3      │
│ - Experience*   │
│ - Skill Area*   │
│ - Resume Upload │
│   OR Text Brief │
└────────┬────────┘
         │ Click "Next"
         ▼
┌─────────────────┐
│  Application    │
│   Step 3/3      │
│ - Why Join?*    │
│ - Commitment*   │
└────────┬────────┘
         │ Click "Submit"
         ▼
┌─────────────────┐
│  Confirmation   │
│     Screen      │
│ "Thanks! We'll  │
│ review within   │
│   48 hours"     │
└─────────────────┘
```

## Flow 2: Admin Application Review

```
┌─────────────────┐
│  Admin Login    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Admin Dashboard │
│   Overview      │
└────────┬────────┘
         │ Click "Applications"
         ▼
┌─────────────────┐
│  Applications   │
│     List        │
│ - Name          │
│ - Email         │
│ - Status        │
│ - Resume Link   │
└────────┬────────┘
         │ Click "AI Screen"
         ▼
┌─────────────────┐
│  AI Screening   │
│   Processing    │
│ (Claude API)    │
│                 │
│ Analyzes:       │
│ - Form data     │
│ - Resume text   │
│ - Consistency   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Screening Result│
│ - Decision      │
│ - Confidence %  │
│ - Reasoning     │
│ - Resume Review │
│ - Consistency   │
│ - Strengths     │
│ - Concerns      │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────┐
│Approve│ │Reject │
└───┬───┘ └───┬───┘
    │         │
    ▼         ▼
┌───────┐ ┌───────┐
│Invite │ │Reject │
│Code   │ │Email  │
│Created│ │Sent   │
└───────┘ └───────┘
```

## Flow 3: Student Registration & Onboarding

```
┌─────────────────────────────────────┐
│  Registration Page                  │
│  /register?code=XXXXXXXX            │
│                                     │
│  - Full Name*                       │
│  - Email*                           │
│  - Password*                        │
│  - Confirm Password*                │
│  - Invitation Code (pre-filled)     │
└──────────────┬──────────────────────┘
               │ Submit
               ▼
┌─────────────────────────────────────┐
│  Onboarding Page                    │
│  Progress: 0/5                      │
│                                     │
│  ☐ Read Code of Conduct             │
│  ☐ Read "How This Program Works"    │
│  ☐ Set Up Dev Environment           │
│  ☐ Join Community                   │
│  ☐ Confirm Commitment               │
└──────────────┬──────────────────────┘
               │ Complete all 5 items
               ▼
┌─────────────────────────────────────┐
│  "Start Learning" Button Unlocked   │
└──────────────┬──────────────────────┘
               │ Click
               ▼
┌─────────────────────────────────────┐
│  Student Dashboard                  │
└─────────────────────────────────────┘
```

## Flow 4: Learning & Assessment

```
┌─────────────────────────────────────┐
│  Student Dashboard                  │
│                                     │
│  AI Engineer Track                  │
│  Progress: 0/4 modules              │
│                                     │
│  Module 1: ▶️ Available             │
│  Module 2: 🔒 Locked                │
│  Module 3: 🔒 Locked                │
│  Module 4: 🔒 Locked                │
└──────────────┬──────────────────────┘
               │ Click Module 1
               ▼
┌─────────────────────────────────────┐
│  Module Page                        │
│                                     │
│  📹 Protected Video Player          │
│     - Watermark overlay             │
│     - Blur on focus loss            │
│     - "Protected Content" badge     │
│                                     │
│  📚 Resources (external links)      │
│                                     │
│  📝 Assessment Required             │
│     [Submit Your Project]           │
│                                     │
│  [Complete Assessment First] 🔒     │
└──────────────┬──────────────────────┘
               │ Click "Submit Your Project"
               ▼
┌─────────────────────────────────────┐
│  Submission Dialog                  │
│                                     │
│  - Project Title*                   │
│  - Description*                     │
│  - Project URL (GitHub/Live)*       │
│  - Screenshots (up to 3)            │
│  - Additional Notes                 │
│                                     │
│  [Submit Project]                   │
└──────────────┬──────────────────────┘
               │ Submit
               ▼
┌─────────────────────────────────────┐
│  Submission Status: Pending         │
│  "Under Review"                     │
└──────────────┬──────────────────────┘
               │ [ADMIN reviews]
               ▼
         ┌─────┴─────┐
         ▼           ▼
    ┌────────┐  ┌────────┐
    │  PASS  │  │ NEEDS  │
    │   ✅   │  │  WORK  │
    └────┬───┘  └────┬───┘
         │           │
         ▼           ▼
┌────────────┐ ┌────────────┐
│Module 2    │ │Feedback    │
│Unlocked    │ │Displayed   │
│            │ │            │
│"Mark as    │ │[Resubmit]  │
│Complete"   │ │            │
│Button      │ │            │
│Enabled     │ │            │
└────────────┘ └────────────┘
```

## Flow 5: Certificate Generation

```
┌─────────────────────────────────────┐
│  Student Dashboard                  │
│                                     │
│  AI Engineer Track                  │
│  Progress: 4/4 modules ✅           │
│                                     │
│  🎉 Congratulations!                │
│  You've completed all modules       │
│                                     │
│  [Generate Certificate]             │
└──────────────┬──────────────────────┘
               │ Click
               ▼
┌─────────────────────────────────────┐
│  Certificate Generated              │
│                                     │
│  PDF includes:                      │
│  - Student name                     │
│  - Track name                       │
│  - Completion date                  │
│  - Certificate ID                   │
│  - Day Learning branding            │
│                                     │
│  [View Certificate] (PDF download)  │
└─────────────────────────────────────┘
```

---

# 6. FEATURE SPECIFICATIONS

## 6.1 Application System

### Multi-Step Application Form

**Step 1: Personal Information**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Full Name | Text | Yes | Min 2 characters |
| Email | Email | Yes | Valid email format |
| Phone | Tel | No | None |
| LinkedIn URL | URL | No | Valid URL format |

**Step 2: Professional Experience**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Years of Experience | Select | Yes | Options: 1-2, 3-5, 6-10, 10+ |
| Primary Skill Area | Select | Yes | Options: Frontend, Backend, Full Stack, Mobile, DevOps, Data Engineering, Other |
| Resume | File Upload | Conditional | PDF or DOCX, max 5MB |
| Brief | Textarea | Conditional | Min 50 characters |

*Either Resume OR Brief is required*

**Step 3: Motivation**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Why Join | Textarea | Yes | Min 50 characters |
| Commitment | Checkbox | Yes | Must be checked |

### Application Statuses
| Status | Description |
|--------|-------------|
| `pending_review` | New application, awaiting admin |
| `under_ai_review` | AI screening in progress |
| `ai_reviewed` | AI screening complete, awaiting decision |
| `approved` | Accepted, invitation code generated |
| `rejected` | Not accepted |

## 6.2 AI Screening System

### How It Works

1. Admin clicks "AI Screen" on an application
2. System extracts text from uploaded resume (PDF/DOCX)
3. Claude API receives:
   - All form responses
   - Full resume text (up to 3000 characters)
4. Claude analyzes and returns structured JSON

### AI Screening Prompt Structure

```
You are screening applicants for Day Learning...

=== APPLICATION FORM RESPONSES ===
- Name, Email, Experience, Skill Area
- Why they want to join
- Self-written brief

=== RESUME/CV CONTENT ===
[Extracted text from PDF/DOCX]

=== YOUR TASK ===
Analyze BOTH form responses AND resume content.
Look for:
1. Consistency between claims and resume
2. Evidence of real projects/work
3. Relevant skills and experience
4. Red flags (exaggeration, vagueness, mismatches)

Return JSON with:
- decision: approve/reject/maybe
- confidence: 0-100
- reasoning
- resume_analysis
- consistency_check
- strengths
- concerns
```

### AI Response Format
```json
{
  "decision": "approve",
  "confidence": 85,
  "reasoning": "Strong background with demonstrated project experience...",
  "resume_analysis": "Well-structured resume showing 4 years of...",
  "consistency_check": "Form responses align with resume. Experience claims verified.",
  "strengths": [
    "4 years of professional experience",
    "Multiple shipped projects",
    "Clear motivation for AI learning"
  ],
  "concerns": [],
  "suggested_track": "AI Engineer"
}
```

## 6.3 Student Onboarding

### Onboarding Checklist Items

| # | Item | Key | Content Summary |
|---|------|-----|-----------------|
| 1 | Code of Conduct | `code_of_conduct` | Respect, integrity, commitment, giving back, building real things |
| 2 | How This Program Works | `how_it_works` | Video-based learning, project assessments, human review, certification |
| 3 | Dev Environment Setup | `dev_environment` | Code editor, Git/GitHub, Node.js/Python, API keys |
| 4 | Join Community | `join_community` | Community platform link (placeholder) |
| 5 | Confirm Commitment | `confirm_commitment` | 5-10 hours/week, complete all modules, communicate challenges |

### Progress Tracking
- Visual progress bar at top
- Each item expandable to show content
- Checkbox to mark complete
- "Start Learning" button unlocks when all 5 complete

## 6.4 Protected Video Player

### Security Measures Implemented

| Measure | Description | Effectiveness |
|---------|-------------|---------------|
| Watermark Overlay | Student name/email repeated across video | Visual deterrent |
| Focus Detection | Video blurs when window loses focus | Medium |
| Right-Click Disabled | Prevents context menu on video | Low (easily bypassed) |
| Keyboard Shortcuts | Blocks PrintScreen, Ctrl+Shift+S, etc. | Low (OS-level not blocked) |
| Screen Capture Detection | Attempts to detect getDisplayMedia API | Medium |
| "Protected Content" Badge | Visual indicator of protection | Awareness |

### Important Disclaimer
True DRM protection (like Netflix's Widevine) requires:
- Encrypted video streams at the source
- Hardware-level decryption
- Licensing agreements with Google/Microsoft

YouTube embeds cannot have hardware-level DRM. These measures are **deterrents**, not foolproof protection.

## 6.5 Assessment & Submission System

### Submission Form Fields
| Field | Type | Required |
|-------|------|----------|
| Project Title | Text | Yes |
| Description | Textarea | Yes |
| Project URL | URL | Yes |
| Screenshots | File Upload (images) | No (max 3) |
| Additional Notes | Textarea | No |

### Submission Statuses
| Status | Badge Color | Description |
|--------|-------------|-------------|
| `pending` | Gray | Awaiting review |
| `pass` | Teal | Approved, module can be completed |
| `needs_work` | Amber | Feedback provided, resubmission needed |
| `fail` | Red | Not accepted |

### Review Dialog (Admin)
- Three decision buttons: Pass / Needs Work / Fail
- Feedback textarea (required)
- Submit review action

## 6.6 Certificate Generation

### Certificate Content
- Header: "CERTIFICATE OF COMPLETION"
- Student full name (large, amber color)
- Track name (teal color)
- "at Day Learning by THCO"
- Issue date
- Certificate ID (for verification)

### Technical Implementation
- Generated using ReportLab (Python)
- PDF format, landscape orientation
- Stored in `/app/backend/certificates/`
- Accessible via `/api/certificates/{filename}`

---

# 7. PAGE-BY-PAGE BREAKDOWN

## 7.1 Landing Page (`/`)

### Sections

**1. Navigation Bar (Fixed)**
- Logo: "D" in teal square + "Day Learning" text
- Links: Login, Apply Now (CTA button)
- Mobile: Hamburger menu

**2. Hero Section**
- Badges: "AI Engineer Track Now Open" + "100% FREE"
- Headline: "Become an AI-Powered Professional"
- Subtext: Multi-track explanation
- CTAs: "Apply Now" + "Learn More"
- Stats: 6+ Tracks, 100% Project-Based, FREE Forever
- Side Card: Training tracks list with status

**3. Training Tracks Section**
- Badge: "100% FREE TRAINING"
- Headline: "Choose Your Track"
- 6 track cards in 3x2 grid
- Each card: Icon, title, subtitle, description, status badge
- AI Engineer has "Apply Now" button

**4. What You'll Learn Section**
- Badge: "AI Engineer Track"
- 4 skill cards: AI-First Thinking, Prompt Engineering, Build AI Apps, Ship to Production

**5. Who This Is For Section**
- Requirements list with checkmarks
- Image of tech collaboration
- Warning note about AI screening

**6. How It Works Section**
- 4 steps: Apply → Get Screened → Learn → Get Certified

**7. About Day Learning Section**
- Thomas Day story
- Quality standard message
- Craftsmanship image

**8. Final CTA Section**
- "Ready to Build Your AI Future?"
- Apply button

**9. Footer**
- Logo and description
- Platform links
- THCO branding
- Tagline

## 7.2 Application Page (`/apply`)

### Layout
- Navbar
- Progress indicator (3 steps)
- Card with form content
- Navigation buttons (Previous/Next/Submit)
- Footer

### Validation
- Email format check
- Required field validation
- File type/size validation (resume)
- Either resume OR brief required

## 7.3 Login Page (`/login`)

### Elements
- Card centered on page
- Email input
- Password input
- "Sign In" button
- Link to Apply

## 7.4 Register Page (`/register`)

### Elements
- Card centered on page
- Full Name input
- Email input
- Password input
- Confirm Password input
- Invitation Code input (pre-filled from URL param)
- "Create Account" button
- Link to Login

## 7.5 Onboarding Page (`/onboarding`)

### Elements
- Progress bar
- 5 expandable checklist items
- Each item has content and checkbox
- "Start Learning" button (disabled until all complete)

## 7.6 Student Dashboard (`/dashboard`)

### Elements
- Welcome message with student name
- Current track card with progress bar
- Quick stats: Submissions, Passed, Pending
- Certificate CTA (if completed)
- Module list with status badges
- Recent submissions list

## 7.7 Module Page (`/module/:id`)

### Elements
- Back to Dashboard link
- Module header (number, title, badges)
- Protected video player
- Resources section
- Assessment section with submission form
- Complete button

## 7.8 Admin Overview (`/admin`)

### Elements
- Stats cards: Applications, Students, Pending, Certificates
- Quick actions: Review Applications, Grade Submissions
- Performance metrics: Approval Rate, Onboarding Rate, Pass Rate

## 7.9 Admin Applications (`/admin/applications`)

### Elements
- Applications list
- Each card shows:
  - Name, email, experience, skill area
  - Download Resume button
  - AI screening results (if run)
  - Invitation code (if approved)
- Actions: View, AI Screen, Approve, Reject
- Detail dialog with full application info

## 7.10 Admin Students (`/admin/students`)

### Elements
- Student list
- Each card shows:
  - Name, email
  - Onboarding status
  - Module progress

## 7.11 Admin Submissions (`/admin/submissions`)

### Elements
- Submissions list (pending first)
- Each card shows:
  - Title, description
  - Project link
  - Submission date
  - Status badge
- Review dialog with Pass/Needs Work/Fail options

## 7.12 Admin Content (`/admin/content`)

### Elements
- Module list
- Each card shows:
  - Order number
  - Title, description
  - Assessment status
  - Published status

## 7.13 Admin Analytics (`/admin/analytics`)

### Elements
- Applications breakdown: Total, Approved, Rejected, Pending, Approval Rate
- Students breakdown: Total, Onboarded, Onboarding Rate
- Submissions breakdown: Total, Passed, Pending, Pass Rate
- Certificates: Total issued

---

# 8. DATABASE ARCHITECTURE

## MongoDB Collections

### applications
```javascript
{
  _id: ObjectId,
  id: "uuid-string",
  full_name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890" | null,
  linkedin_url: "https://linkedin.com/in/johndoe" | null,
  resume_url: "/api/uploads/uuid.pdf" | null,
  brief: "I am a software engineer with..." | null,
  why_join: "I want to learn AI because...",
  experience_years: "3-5",
  skill_area: "Full Stack",
  commitment: true,
  ai_screening_result: {
    decision: "approve",
    confidence: 85,
    reasoning: "...",
    resume_analysis: "...",
    consistency_check: "...",
    strengths: ["..."],
    concerns: [],
    suggested_track: "AI Engineer"
  } | null,
  status: "approved",
  invitation_code: "ABC12345" | null,
  created_at: "2026-02-09T00:00:00.000Z"
}
```

### users
```javascript
{
  _id: ObjectId,
  id: "uuid-string",
  email: "john@example.com",
  password_hash: "$2b$12$...",
  name: "John Doe",
  role: "student" | "reviewer" | "admin" | "super_admin",
  profile_photo: "/api/uploads/photo.jpg" | null,
  application_id: "uuid-string" | null,
  onboarding_completed: true,
  onboarding_items: {
    code_of_conduct: true,
    how_it_works: true,
    dev_environment: true,
    join_community: true,
    confirm_commitment: true
  },
  created_at: "2026-02-09T00:00:00.000Z"
}
```

### tracks
```javascript
{
  _id: ObjectId,
  id: "uuid-string",
  name: "AI Engineer",
  description: "Learn to build and deploy AI-powered solutions...",
  icon: "cpu",
  is_active: true,
  created_at: "2026-02-09T00:00:00.000Z"
}
```

### modules
```javascript
{
  _id: ObjectId,
  id: "uuid-string",
  track_id: "uuid-string",
  title: "Introduction to AI-Powered Development",
  description: "Understand what it means to build with AI...",
  order: 1,
  video_url: "https://www.youtube.com/embed/...",
  resources: [
    { title: "What is AI Engineering?", url: "https://..." },
    { title: "The AI-First Mindset", url: "https://..." }
  ],
  has_assessment: true,
  assessment_prompt: "Write a reflection on...",
  is_published: true,
  created_at: "2026-02-09T00:00:00.000Z"
}
```

### progress
```javascript
{
  _id: ObjectId,
  id: "uuid-string",
  user_id: "uuid-string",
  module_id: "uuid-string",
  status: "locked" | "available" | "in_progress" | "completed",
  completed_at: "2026-02-09T00:00:00.000Z" | null
}
```

### submissions
```javascript
{
  _id: ObjectId,
  id: "uuid-string",
  user_id: "uuid-string",
  module_id: "uuid-string",
  title: "Module 1 - Reflection",
  description: "My reflection on AI-powered development...",
  project_url: "https://github.com/...",
  screenshots: ["/api/uploads/screenshot1.png"],
  notes: "Additional context..." | null,
  status: "pending" | "pass" | "needs_work" | "fail",
  admin_feedback: "Great work! You demonstrated..." | null,
  reviewed_by: "uuid-string" | null,
  created_at: "2026-02-09T00:00:00.000Z",
  reviewed_at: "2026-02-09T00:00:00.000Z" | null
}
```

### certificates
```javascript
{
  _id: ObjectId,
  id: "uuid-string",
  user_id: "uuid-string",
  track_id: "uuid-string",
  issued_at: "2026-02-09T00:00:00.000Z",
  certificate_url: "/api/certificates/certificate_uuid.pdf"
}
```

---

# 9. API DOCUMENTATION

## Base URL
```
https://enterprise-dashboard-11.preview.emergentagent.com/api
```

## Authentication
All protected endpoints require:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Public Endpoints

#### Health Check
```http
GET /api/health
Response: { "status": "healthy" }
```

#### Get Tracks
```http
GET /api/tracks
Response: [{ id, name, description, icon, is_active }]
```

#### Get Modules
```http
GET /api/modules?track_id=<uuid>
Response: [{ id, track_id, title, description, order, video_url, resources, has_assessment, assessment_prompt }]
```

#### Submit Application
```http
POST /api/applications
Content-Type: multipart/form-data

Fields:
- full_name: string (required)
- email: string (required)
- phone: string (optional)
- linkedin_url: string (optional)
- brief: string (optional)
- why_join: string (required)
- experience_years: string (required)
- skill_area: string (required)
- commitment: boolean (required)
- resume: file (optional, PDF/DOCX)

Response: { message: "Application submitted successfully", id: "uuid" }
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "invitation_code": "ABC12345"
}

Response: { token: "jwt...", user: { id, email, name, role } }
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "securepassword"
}

Response: { token: "jwt...", user: { id, email, name, role, onboarding_completed } }
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>

Response: { id, email, name, role, onboarding_completed, onboarding_items, profile_photo }
```

### Student Endpoints

#### Get Onboarding Status
```http
GET /api/onboarding/status
Authorization: Bearer <token>

Response: { onboarding_items: {...}, onboarding_completed: boolean }
```

#### Complete Onboarding Item
```http
PUT /api/onboarding/item/{item_key}
Authorization: Bearer <token>

Response: { message: "Onboarding item updated", onboarding_completed: boolean }
```

#### Get Progress
```http
GET /api/progress
Authorization: Bearer <token>

Response: [{ id, user_id, module_id, status, completed_at }]
```

#### Start Module
```http
POST /api/progress/{module_id}/start
Authorization: Bearer <token>

Response: { message: "Module started" }
```

#### Complete Module
```http
POST /api/progress/{module_id}/complete
Authorization: Bearer <token>

Response: { message: "Module completed" }
```

#### Submit Assessment
```http
POST /api/submissions
Authorization: Bearer <token>
Content-Type: multipart/form-data

Fields:
- module_id: string (required)
- title: string (required)
- description: string (required)
- project_url: string (required)
- notes: string (optional)
- screenshots: files (optional, max 3)

Response: { message: "Submission created", id: "uuid" }
```

#### Get My Submissions
```http
GET /api/submissions
Authorization: Bearer <token>

Response: [{ id, user_id, module_id, title, description, project_url, screenshots, status, admin_feedback, created_at }]
```

#### Generate Certificate
```http
POST /api/certificates/generate
Authorization: Bearer <token>

Response: { certificate_url: "/api/certificates/file.pdf", id: "uuid" }
```

#### Get My Certificates
```http
GET /api/certificates
Authorization: Bearer <token>

Response: [{ id, user_id, track_id, issued_at, certificate_url }]
```

### Admin Endpoints

#### Get All Applications
```http
GET /api/applications?status=<status>
Authorization: Bearer <token> (admin role required)

Response: [{ ...application_data }]
```

#### Get Application Details
```http
GET /api/applications/{application_id}
Authorization: Bearer <token> (admin role required)

Response: { ...application_data }
```

#### Run AI Screening
```http
POST /api/applications/{application_id}/screen
Authorization: Bearer <token> (admin role required)

Response: { message: "AI screening completed", result: { decision, confidence, reasoning, ... } }
```

#### Approve Application
```http
POST /api/applications/{application_id}/approve
Authorization: Bearer <token> (admin role required)

Response: { message: "Application approved", invitation_code: "ABC12345" }
```

#### Reject Application
```http
POST /api/applications/{application_id}/reject
Authorization: Bearer <token> (admin role required)

Response: { message: "Application rejected" }
```

#### Get All Students
```http
GET /api/admin/students
Authorization: Bearer <token> (admin role required)

Response: [{ id, name, email, onboarding_completed, progress: { completed, total } }]
```

#### Get Analytics
```http
GET /api/admin/analytics
Authorization: Bearer <token> (admin role required)

Response: {
  applications: { total, approved, rejected, pending, approval_rate },
  students: { total, onboarded, onboarding_rate },
  submissions: { total, passed, pending, pass_rate },
  certificates: { total }
}
```

#### Review Submission
```http
POST /api/submissions/{submission_id}/review
Authorization: Bearer <token> (reviewer role required)
Content-Type: application/json

Body:
{
  "status": "pass" | "needs_work" | "fail",
  "admin_feedback": "Your feedback here..."
}

Response: { message: "Submission reviewed" }
```

#### Update User Role (Super Admin Only)
```http
PUT /api/admin/users/{user_id}/role?role=<new_role>
Authorization: Bearer <token> (super_admin role required)

Response: { message: "Role updated" }
```

---

# 10. TECHNICAL STACK

## Backend

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | FastAPI | Latest |
| Language | Python | 3.11 |
| Database | MongoDB | Latest |
| ODM | Motor (async) | Latest |
| Auth | JWT + bcrypt | - |
| AI | Anthropic Claude API | claude-sonnet-4-20250514 |
| Email | Resend | Latest |
| PDF | ReportLab | Latest |
| File Parsing | PyPDF2, python-docx | Latest |

### Python Dependencies
```
fastapi
uvicorn
motor
pydantic
python-dotenv
python-jose[cryptography]
bcrypt
anthropic
resend
reportlab
aiofiles
python-multipart
PyPDF2
python-docx
```

## Frontend

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | React | 19 |
| Language | JavaScript (ES6+) | - |
| Build Tool | Create React App | - |
| Styling | Tailwind CSS | 3.x |
| Components | shadcn/ui | - |
| Animation | Framer Motion | Latest |
| Routing | React Router | 6.x |
| HTTP | Axios | Latest |
| Notifications | Sonner | Latest |
| Icons | Lucide React | Latest |

### Key Frontend Libraries
```json
{
  "react": "^19.0.0",
  "react-router-dom": "^7.1.1",
  "axios": "^1.7.9",
  "framer-motion": "^11.18.0",
  "tailwindcss": "^3.4.17",
  "lucide-react": "^0.469.0",
  "sonner": "^1.7.2",
  "@radix-ui/react-*": "various"
}
```

---

# 11. SECURITY IMPLEMENTATION

## Authentication

### JWT Token Structure
```javascript
{
  "user_id": "uuid-string",
  "role": "student",
  "exp": 1234567890  // 7 days from creation
}
```

### Password Hashing
- Algorithm: bcrypt
- Salt rounds: Auto-generated

### Role-Based Access Control
- Middleware checks JWT token on protected routes
- Role extracted from token payload
- Endpoints validate required role before processing

## Content Protection

### Video Protection Measures
1. **Watermark Overlay** - Student identity visible on video
2. **Focus Detection** - Blur video when tab/window loses focus
3. **Right-Click Prevention** - Context menu disabled
4. **Keyboard Shortcut Blocking** - PrintScreen, screenshot shortcuts
5. **Screen Capture API Detection** - Attempt to detect screen sharing

### File Upload Security
- File type validation (PDF, DOCX, images)
- File size limits (5MB for resumes)
- Stored in local filesystem (not in database)
- Served via authenticated endpoints

---

# 12. THIRD-PARTY INTEGRATIONS

## Anthropic Claude API

**Purpose:** AI-powered application screening

**Model:** claude-sonnet-4-20250514

**Usage:**
- Analyze application form responses
- Extract and analyze resume text
- Check consistency between claims and evidence
- Provide structured assessment

**Cost:** Per-token pricing (see Anthropic pricing)

## Resend Email API

**Purpose:** Transactional emails

**Current Emails:**
1. Application Approval (with invitation code)
2. Application Rejection

**Configuration:**
- API Key required
- Sender email must be verified domain
- Currently using test domain (onboarding@resend.dev)

**To Enable Production Emails:**
1. Add domain in Resend dashboard
2. Configure DNS records
3. Update SENDER_EMAIL in backend .env

---

# 13. FILE STRUCTURE

```
/app/
├── backend/
│   ├── server.py              # Main FastAPI application
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables
│   ├── uploads/               # Uploaded files (resumes, screenshots)
│   └── certificates/          # Generated PDF certificates
│
├── frontend/
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── src/
│   │   ├── index.js           # React entry point
│   │   ├── index.css          # Global styles
│   │   ├── App.js             # Main app with routes
│   │   ├── App.css            # App styles
│   │   ├── context/
│   │   │   └── AuthContext.js # Authentication context
│   │   ├── components/
│   │   │   ├── Layout.js      # Navbar, Footer
│   │   │   ├── ProtectedVideoPlayer.js
│   │   │   └── ui/            # shadcn components
│   │   └── pages/
│   │       ├── LandingPage.js
│   │       ├── ApplicationPage.js
│   │       ├── AuthPages.js   # Login, Register
│   │       ├── OnboardingPage.js
│   │       ├── StudentDashboard.js
│   │       ├── ModulePage.js
│   │       └── AdminPages.js  # All admin pages
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env
│
├── memory/
│   └── PRD.md                 # This document
│
└── test_reports/              # Test results
```

---

# 14. ENVIRONMENT CONFIGURATION

## Backend Environment Variables

**File:** `/app/backend/.env`

```env
# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database

# CORS
CORS_ORIGINS=*

# AI Integration
ANTHROPIC_API_KEY=sk-ant-api03-...

# Email Integration
RESEND_API_KEY=re_...
SENDER_EMAIL=onboarding@resend.dev

# Authentication
JWT_SECRET=daylearning_jwt_secret_key_2024_thco
```

## Frontend Environment Variables

**File:** `/app/frontend/.env`

```env
REACT_APP_BACKEND_URL=https://enterprise-dashboard-11.preview.emergentagent.com
```

---

# 15. DEPLOYMENT INFORMATION

## Current Deployment

**Platform:** Emergent  
**URL:** https://enterprise-dashboard-11.preview.emergentagent.com

## Services

| Service | Port | Process Manager |
|---------|------|-----------------|
| Backend (FastAPI) | 8001 | Supervisor |
| Frontend (React) | 3000 | Supervisor |
| MongoDB | 27017 | System |

## Supervisor Commands
```bash
# Restart backend
sudo supervisorctl restart backend

# Restart frontend
sudo supervisorctl restart frontend

# Check status
sudo supervisorctl status

# View logs
tail -f /var/log/supervisor/backend.err.log
tail -f /var/log/supervisor/frontend.err.log
```

---

# 16. CURRENT DATA & CREDENTIALS

## Admin Access

| Field | Value |
|-------|-------|
| Email | joshua@thcohq.com |
| Password | admin123 |
| Role | super_admin |
| Login URL | /login |
| Dashboard URL | /admin |

## Test Student Access

| Field | Value |
|-------|-------|
| Email | ayo@thcohq.com |
| Password | student123 |
| Role | student |
| Status | Onboarding complete |
| Login URL | /login |
| Dashboard URL | /dashboard |

## Seeded Track & Modules

**Track:** AI Engineer (ID in database)

| Module | Order | Has Assessment |
|--------|-------|----------------|
| Introduction to AI-Powered Development | 1 | Yes |
| Prompt Engineering Fundamentals | 2 | Yes |
| Building Your First AI Application | 3 | Yes |
| Deployment & Production Readiness | 4 | Yes |

---

# 17. KNOWN LIMITATIONS

## Email Delivery
- **Issue:** Using Resend test domain (onboarding@resend.dev)
- **Impact:** Emails only deliver to Resend account owner
- **Solution:** Verify custom domain in Resend dashboard

## Video Protection
- **Issue:** YouTube embeds cannot have true DRM
- **Impact:** Determined users can still record
- **Solution:** Consider self-hosted video with Widevine DRM (significant investment)

## File Storage
- **Issue:** Using local filesystem
- **Impact:** Files lost if server is reset/moved
- **Solution:** Migrate to cloud storage (S3, GCS)

## Single Track
- **Issue:** Only AI Engineer track is active
- **Impact:** Other tracks are placeholders
- **Solution:** Create content and activate tracks

## Mobile Responsiveness
- **Issue:** Some admin features optimized for desktop
- **Impact:** Admin experience on mobile is limited
- **Solution:** Enhance mobile admin UI

---

# 18. FUTURE ROADMAP

## Phase 2 - Enhancements (P1)

- [ ] Custom email domain setup
- [ ] Enhanced certificate design with THCO branding
- [ ] Full module CRUD in admin UI
- [ ] Student profile page with photo upload
- [ ] Email notifications for submission feedback
- [ ] Community integration (Discord/Slack links)
- [ ] Module completion email notifications
- [ ] Bulk application actions (approve/reject multiple)

## Phase 3 - Expansion (P2)

- [ ] Additional tracks activation
  - AI Finance Professional
  - AI Marketer
  - AI Brand Architect
  - AI Sales Professional
  - AI Business Analyst
- [ ] Cohort/batch management
- [ ] In-app messaging
- [ ] Discussion forums per module
- [ ] LinkedIn certificate sharing
- [ ] Peer review system
- [ ] Leaderboards

## Phase 4 - Scale (P3)

- [ ] Payment integration for premium tracks
- [ ] Enterprise/team accounts
- [ ] Custom track creation
- [ ] Advanced analytics with charts
- [ ] A/B testing for landing page
- [ ] Referral system
- [ ] Mobile app (React Native or PWA)
- [ ] API for third-party integrations
- [ ] Multi-language support

---

# APPENDIX

## A. Quick Reference Commands

### Start Services
```bash
sudo supervisorctl start backend
sudo supervisorctl start frontend
```

### View Logs
```bash
tail -f /var/log/supervisor/backend.err.log
tail -f /var/log/supervisor/frontend.err.log
```

### Database Access
```bash
mongosh
use test_database
db.users.find()
db.applications.find()
```

### Test API
```bash
# Health check
curl https://enterprise-dashboard-11.preview.emergentagent.com/api/health

# Login
curl -X POST https://enterprise-dashboard-11.preview.emergentagent.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joshua@thcohq.com","password":"admin123"}'
```

## B. Color Codes Quick Reference

| Name | Hex | Tailwind Class |
|------|-----|----------------|
| Teal | #2A9D8F | `text-teal`, `bg-teal` |
| Amber | #E9C46A | `text-amber`, `bg-amber` |
| Coral | #E76F51 | `text-coral`, `bg-coral` |
| Background | #0A0A0A | `bg-background` |
| Foreground | #EDEDE9 | `text-foreground` |

## C. Contact

**Platform:** Day Learning  
**Parent Company:** THCO  
**Admin Contact:** joshua@thcohq.com

---

*End of Document*

*Generated: February 2026*
*Version: 1.0 MVP*
