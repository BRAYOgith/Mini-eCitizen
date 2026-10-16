# eCitizen Public Service Request System (Mini eCitizen)

An interactive, responsive Public Service Request System replicating the core architecture and user experience of Kenya's **eCitizen** portal (`ecitizen.go.ke`). Designed for an IT assignment and optimized for zero-configuration deployment to **Vercel**.

---

## Key Features & Functional Modules

### 1. Citizen Service Directory
- Official service directory categorized by government department:
  - **DCI**: Police Clearance Certificate (Certificate of Good Conduct)
  - **NTSA**: Smart Driving License Application & Renewal
  - **BRS**: Business Name & Enterprise Registration
  - **CRS**: Birth Certificate Issuance & Replacement
  - **IMMIGRATION**: 34-Page Kenyan Ordinary Passport Application
- Real-time service filtering and instant search.

### 2. Multi-Step Service Application Wizard
- **Step 1: Applicant Biodata**: Real-time validation for Kenyan 7-8 digit National ID, phone number formatting, and county selection.
- **Step 2: Service-Specific Requirements**: Dynamic questionnaires tailored to each government department.
- **Step 3: Secure Document Upload**: Drag-and-drop file upload with live client-side validation and file preview.
- **Step 4: Statutory Fee & Confirmation**: Instant reference tracking generation (e.g., `ECZ-DCI-2026-839210`).

### 3. Citizen Request Tracker
- Visual step-by-step progress timeline:
  `Submitted` ➔ `Under Review` ➔ `Authorized` ➔ `Certificate Issued`
- Search requests by reference tracking code, National ID, or applicant name.
- Direct launch for approved electronic certificates.

### 4. Government Officer / Admin Back-Office Console
- Role-based clearance gate protected by Officer Access Passcode (`KENYA2026` or `1234`).
- Real-time operational metrics: Total Requests, Pending Review, Approved/Issued, and Statutory Revenue.
- Full dossier inspection: Applicant biodata, service responses, and attached documents.
- Officer decision actions: **Approve & Issue Certificate**, **Request Clarification**, or **Reject** with audit remarks.

### 5. Authentic Printable Digital Certificate
- High-fidelity official Republic of Kenya certificate layout.
- Cryptographically generated serial number and tamper-proof security checksum.
- Embedded scannable QR verification badge.
- Printable layout (`window.print()`) formatted for A4 PDF download.

### 6. Public Document Verification Portal
- Independent verification page for employers, banks, and authorities to verify document validity against the registry.

---

## Security Features Implemented

1. **Input Sanitization & XSS Defense**: Sanitizes all user-submitted text fields before persistence.
2. **Kenyan National ID Validation**: Enforces statutory 7 to 8 numeric digit format.
3. **File Upload Security Rules**: Restricts uploads strictly to legitimate MIME types (`PDF`, `PNG`, `JPG`, `WEBP`) and enforces a 5MB size limit to prevent memory exhaustion.
4. **Role-Based Access Control (RBAC)**: Protects administrative clearance workflows behind a secure Officer Passcode modal.
5. **Tamper-Proof Cryptographic Checksums**: Generates a reproducible security hash for every issued certificate based on applicant ID, tracking reference, and authorization timestamp.
6. **Anti-Spam Rate-Limiting**: Throttles repeated submissions to protect against automated flooding.

---

## Local Development Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## How to Deploy to Vercel

1. Push this repository to GitHub or run:
```bash
npx vercel
```
2. Accept the default settings. Next.js App Router will deploy automatically with zero configuration.
