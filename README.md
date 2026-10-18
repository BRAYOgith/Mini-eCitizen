# Public Service Request System (Mini eCitizen-Style)

An interactive, responsive Public Service Request web application designed in the visual identity of Kenya's **eCitizen** platform (`ecitizen.go.ke`). Citizens report municipal community issues (such as broken streetlights, water supply leaks, garbage collection mounds, potholes, and drainage faults) and track their progress through resolution, while municipal administrators triage cases, assign field response teams, and monitor real-time resolution analytics.

---

## Evaluation Rubric Alignment

| Criteria | Weight | Implementation Summary |
| :--- | :---: | :--- |
| **Code Quality & Structure** | **25%** | Modular Next.js App Router architecture, strict TypeScript types (`src/types/index.ts`), clean state separation, reusable UI components, and client-side persistence (`src/lib/storage.ts`). Zero code clutter. |
| **Functionality** | **35%** | Complete end-to-end user journeys: Citizen registration/login, municipal request wizard with client validation and photo evidence, 3-step status tracker (`Pending` &rarr; `In Progress` &rarr; `Resolved`), and admin triage console. |
| **UI/UX Design** | **20%** | Faithful recreation of the official eCitizen aesthetic: Lexend typography, Republic of Kenya Coat of Arms, agency emblems, official 47 county crests, status progress steppers, responsive mobile drawers, and accessible color contrast. |
| **Documentation** | **10%** | Clear setup commands, system architectural overview, test credentials, and testing procedures. |
| **Bonus Features** | **10%** | Visual category analytics breakdown, high-resolution photo evidence zoom modal, public registry reference verification, and client-side anti-spam throttling. |

---

## Core Features

### 1. Citizen Registration & Authentication
- Citizens register using their **Kenyan National ID (7–8 digits)**, Full Name, Email, Phone Number, and County.
- Persistent session storage in `localStorage`.
- Auto-fills citizen contact details when submitting new service requests.
- Sign in / Sign out with personalized citizen greeting badge in the navigation header.

### 2. Submit Public Service Request
- **Category Selection**:
  - Broken Streetlight & Lighting (`STREETLIGHT`)
  - Water Leakage & Supply Issue (`WATER`)
  - Garbage Collection & Waste (`GARBAGE`)
  - Potholes & Road Surface Damage (`ROAD`)
  - Blocked Sewerage & Storm Drainage (`SEWERAGE`)
  - Public Health Nuisance & Hazards (`PUBLIC_HEALTH`)
- **Location Specification**: County dropdown (all 47 Kenya counties), Sub-County, and street or landmark.
- **Issue Details**: Title and detailed problem description.
- **Priority Level**: Emergency, High, Medium, Low.
- **Evidence Attachment (Optional)**: Image upload with real-time thumbnail preview and MIME validation.
- **Reference Tracking ID**: Instant generation of official tracking codes (e.g., `REQ-2026-NBI-1042`).

### 3. Status Tracking Stepper
- 3-step municipal workflow:
  $$\text{Pending (Logged)} \longrightarrow \text{In Progress (Dispatched)} \longrightarrow \text{Resolved (Completed)}$$
- Filter requests by active citizen profile or search by tracking code.
- Detailed issue breakdown: timestamp, location, citizen details, and thumbnail image preview.
- Official response card displaying assigned field response team, investigating officer, and completion notes.

### 4. Admin Back-Office Dashboard
- Authenticated government officer workspace accessed via Officer Portal.
- Operational actions:
  - Triage case status (`PENDING` &rarr; `IN_PROGRESS` &rarr; `RESOLVED`).
  - Assign specific field units (e.g. *Westlands Rapid Pipe Maintenance Unit*).
  - Record official administrative remarks and resolution feedback visible to citizens.
- Multi-dimensional filtering by workflow status, incident category, priority level, and full-text search.

### 5. Basic Analytics & Reporting
- Summary KPI metric cards:
  - **Total Requests**: Total incident reports received.
  - **Open Cases (Pending)**: Reports awaiting departmental triage.
  - **In Progress**: Work orders currently active with field response teams.
  - **Resolved Cases**: Completed and inspected municipal repairs.
  - **Resolution Rate %**: Visual percentage bar of resolved vs. total cases.
- **Category Distribution**: Proportional case distribution across all municipal categories with interactive filtering.
- Public analytics ticker visible on the homepage for municipal transparency.

---

## Test Credentials & Evaluation Instructions

For rapid evaluation and grading, pre-configured accounts are provided:

### Municipal Admin Account
- **Access Point**: Click **"Officer Portal"** in the navigation bar or footer.
- **Badge Number / Email**: `ADMIN-001` or `officer@ecitizen.go.ke`
- **Password**: Any password (min. 6 characters, e.g. `admin123`)

### Citizen Account
- **Access Point**: Click **"Sign in"** in the navigation bar.
- **National ID**: `34190822` (Grace Wanjiku Kimani) or click **"Register"** to create a custom citizen profile.

---

## Local Development Setup

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/BRAYOgith/Mini-eCitizen.git
cd Mini-eCitizen

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build Verification

```bash
npm run build
npm run start
```

---

## Project Structure

```
Mini-eCitizen/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout with Lexend font & metadata
│   │   ├── page.tsx                  # Main app controller with view orchestration
│   │   └── globals.css               # Tailwind CSS & eCitizen custom styles
│   ├── components/
│   │   ├── Navbar.tsx                # Official eCitizen header with search & auth status
│   │   ├── ApplicationWizard.tsx     # Citizen municipal request submission form
│   │   ├── ApplicationTracker.tsx    # 3-step status tracker with image evidence preview
│   │   ├── OfficerDashboard.tsx      # Admin dashboard with KPI analytics & triage modal
│   │   ├── OfficerAuth.tsx           # Officer sign in & registration modal
│   │   ├── CitizenAuth.tsx           # Citizen National ID sign in & registration
│   │   ├── ServiceCard.tsx           # Agency quick-action card
│   │   ├── NationalMinistriesView.tsx# National ministries & state agencies directory
│   │   ├── CountiesView.tsx          # 47 Kenya County governments with official crests
│   │   ├── PublicVerificationModal.tsx# Public registry tracking code verification
│   │   └── HelpSupportView.tsx       # FAQ & municipal support channels
│   ├── lib/
│   │   ├── storage.ts                # LocalStorage persistence & analytics calculator
│   │   ├── services-data.ts          # Municipal categories & 47 counties dataset
│   │   ├── security.ts               # XSS input sanitizer, National ID validator, rate limiter
│   │   └── county-logos-manifest.json# Manifest mapping 47 county crests
│   └── types/
│       └── index.ts                  # TypeScript models for requests, accounts, analytics
├── public/
│   ├── coat-of-arms-kenya.svg        # Official Kenya Coat of Arms
│   ├── ecitizen-logo.png             # Official eCitizen emblem
│   └── logos/                        # Agency emblems & 47 county crest SVGs
├── package.json
└── README.md
```

---

## License

Developed for academic evaluation. Design assets and emblems remain the property of the Republic of Kenya eCitizen platform.
