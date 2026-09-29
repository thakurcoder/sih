# VidyaSetu (विद्यासेतु)
### National AI-Enabled Unified Scholarship & Fellowship Governance Ecosystem
**Ministry of Tribal Affairs (MoTA), Government of India (जनजातीय कार्य मंत्रालय, भारत सरकार)**  
**Smart India Hackathon (SIH) 2026 — Problem Statement ID: 239 (Software Edition | Theme: Smart Education)**

[![Government of India](https://img.shields.io/badge/Government_of_India-Ministry_of_Tribal_Affairs-1e3a8a.svg)](#)
[![SIH 2026](https://img.shields.io/badge/SIH_2026-Problem_Statement_239-purple.svg)](#)
[![Theme](https://img.shields.io/badge/Theme-Smart_Education-emerald.svg)](#)
[![All 5 MoTA Schemes](https://img.shields.io/badge/Schemes_Covered-All_5_MoTA_DBT_Schemes-blue.svg)](#)
[![National Portals Integrated](https://img.shields.io/badge/SSO_Adapters-Jan_Parichay_%7C_DigiLocker-blue.svg)](#)
[![DBT Sandbox](https://img.shields.io/badge/Payments_Sandbox-PFMS_%7C_NPCI_APB-orange.svg)](#)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG_2.1_AA_Target_%7C_GIGW_2.0-teal.svg)](#)

---

## 🎯 SIH 2026 Problem Statement 239 — Direct Compliance & Mapping

> **Problem Statement ID:** 239  
> **Ministry / Department:** Ministry of Tribal Affairs (MoTA)  
> **Category:** Software  
> **Theme:** Smart Education  
> **Official Portals & Data Sets:**  
> • [Ministry of Tribal Affairs Scholarship Portal](https://tribal.nic.in/ScholarshiP.aspx)  
> • [MoTA Direct Benefit Transfer (DBT) Portal](https://dbttribal.gov.in/AllScheme.aspx)

### Exact 1-to-1 Mapping Against SIH 2026 PS 239 Specifications:

| SIH PS 239 Required Capability | Specific Problem Statement Mandate | VidyaSetu Implementation & Technical Architecture |
| :--- | :--- | :--- |
| **1. End-to-End Digital Workflow** | Manage complete process: registration, online application, document submission, eligibility verification, scrutiny, screening, selection, communication, and post-selection management. | **8-Stage Unified Digital Lifecycle**: Discover ➔ Apply ➔ Verify ➔ Scrutinize ➔ Select ➔ Communicate ➔ Disburse ➔ Monitor in a single unified platform. |
| **2. Configurable Scheme Rules** | Handle different eligibility criteria, documents, and selection processes applicable to individual schemes through a configurable system. | **Unified 5-Scheme Configuration Studio & Engine** (`SchemeConfigStudio.jsx` & `ruleEngine.js`): Dynamic rule parameters covering all 5 official MoTA schemes (Pre-Matric, Post-Matric, Top Class ST, NFST, and NOS) without code redeployment. |
| **3. AI OCR & Document Intelligence** | Use automation and AI-based tools to reduce manual verification, identify incomplete or deficient applications, and improve accuracy. | **AI Document Pre-Scrutiny Service** (`documentAI.js`): Optical character extraction, bounding-box coordinate mapping, digital barcode verification, and automatic detection of lapsed validity (e.g. Income Certificate > 1 fiscal year old). Architected to integrate production OCR engines (e.g., Google Document AI / Tesseract). |
| **4. Deficiency Resolution Loop** | Provide workflow management for applicants and administrators, including deficiency identification, communication, resubmission, and status tracking. | **Stateful Deficiency Desk** (`DeficiencyDesk.jsx`): Interactive replacement certificate upload (`Fresh_Income_Certificate_FY2026_27_SDO_Ranchi.pdf`) with live AI re-scan, automatically shifting state to `READY FOR HUMAN REVIEW` with preserved seniority. |
| **5. Transparent Selection & Human Oversight** | Support transparent screening and selection by applying approved scheme criteria while retaining appropriate human oversight. | **Application X-Ray Dual-Pane Workstation** (`OfficerScrutinyDesk.jsx`): Left pane displays demographic data and deterministic rule checklist; Right pane displays document canvas with OCR bounding boxes. Includes mandatory **Human Officer Override** and **Statutory Rejection** clause logging. *"AI assists, rules govern, humans decide."* |
| **6. Scheme-Specific Selection Allocation** | Merit-based selection reflecting distinct scheme rules rather than generic formulas. | **Statutory Allocation Engines** (`MeritRankingEngine.jsx`): Pre-Matric & Post-Matric universal entitlements; Top Class institutional rank allocation; NFST PG marks + 30% horizontal female quota + 5% Divyangjan + PVTG slots; NOS QS World Top 500/200 offers + Expert Committee. |
| **7. Separate Applicant & Admin Interfaces** | Provide separate interfaces: applicants track applications and respond to queries; Ministry officials monitor applications, scrutiny, selection, and scheme performance. | **Strictly Isolated Role-Based Workspaces**: <br>• **Scholar Desk**: Visual end-to-end status tracker, document viewer, deficiency redressal desk, and quarterly progress report (QPR) hub.<br>• **Ministry Administrative Workspace**: Executive KPIs, dual-pane scrutiny desk, shared-identifier anomaly triage, scheme config studio, and PFMS DBT hub. |
| **8. Dashboards & National Analytics** | Enable MoTA to monitor applications, verification, selection, and scheme performance across relevant parameters. | **Executive Intelligence & GIS Analytics** (`NationalAnalytics.jsx`): Real-time KPI counters across all 5 schemes, state-wise application heatmaps, turnaround time (TAT) tracking, PVTG inclusion metrics, and downloadable official ministry reports. |

---

## 🏛️ Executive Summary & Architectural Vision

The **Ministry of Tribal Affairs (MoTA)** administers 5 active higher-education scholarship and fellowship programs to empower Scheduled Tribe (ST) students across schools, premier Indian universities, and top global institutions ([dbttribal.gov.in](https://dbttribal.gov.in/AllScheme.aspx)):

1. **Pre-Matric Scholarship Scheme for ST Students**: Centrally sponsored secondary school assistance for regular ST scholars in Classes IX & X with family income ≤ ₹2.50 LPA (Day Scholar: ₹225/mo, Hosteller: ₹525/mo, Books Grant: ₹750/yr).
2. **Post-Matric Scholarship Scheme for ST Students**: Flagship Centrally Sponsored scheme covering higher secondary (Classes XI–XII), ITI, Polytechnic, Diploma, Undergraduate, and Postgraduate courses across 4 recognized course groups with family income ≤ ₹2.50 LPA (100% compulsory non-refundable fees + living allowance up to ₹1,200/mo).
3. **Top Class Education for ST Students**: 100% tuition coverage, ₹45,000 IT hardware grant, books allowance, and monthly living assistance in notified premier institutions (IITs, IIMs, NITs, AIIMS, NLUs, NIDs) for scholars with family income ≤ ₹6.00 LPA.
4. **National Fellowship for Scheduled Tribe Students (NFST)**: 750 annual research fellowships for regular M.Phil and Ph.D. scholars in Indian universities with family income ≤ ₹6.00 LPA (₹37,000–₹42,000/mo JRF/SRF stipend, HRA, and ₹20,500 annual contingency).
5. **National Overseas Scholarship (NOS)**: 100% actual tuition fee coverage, economy return airfare, and annual living allowance (GBP 9,900 / USD 15,400) for Master's and Ph.D. studies at **QS World Top 1,000** universities (priority to top-ranked institutions) with family income ≤ ₹6.00 LPA. 20 awards: 17 ST + 3 PVTG, with 6 earmarked for women. *(Source: tribal.nic.in/ScholarshiP.aspx)*

### The Core Problem Addressed
* **Manual Scrutiny Delays**: Applications historically required 4 to 6 months of multi-tier verification across school/university, district, state, and ministry desks.
* **Repetitive Correspondence**: Minor document deficiencies (lapsed annual income certificates, smudged revenue seals) led to prolonged delays and accidental rejections.
* **Hardcoded Eligibility Engines**: Legacy portals could not accommodate annual quota modifications or affirmative action adjustments without code redeployments.
* **Post-Selection Bottlenecks**: Absence of automated tracking for supervisor-endorsed Quarterly Progress Reports (QPR) and timely Direct Benefit Transfer (DBT) release through PFMS.

**VidyaSetu (विद्यासेतु)** bridges the existing government scholarship ecosystem (NSP, DigiLocker, PFMS, NPCI) through an intelligent orchestration layer to human scrutiny officers:  
**Discover ➔ Apply ➔ Verify ➔ Scrutinize ➔ Select ➔ Communicate ➔ Disburse ➔ Monitor**

> [!NOTE]
> **Prototype Architecture & Sandbox Grounding:**  
> VidyaSetu is a functional, modular prototype built for Smart India Hackathon 2026. External interfaces (UIDAI Aadhaar e-KYC, DigiLocker repository, PFMS e-FTO, and NPCI Aadhaar Payment Bridge) are implemented as **integration-ready sandbox adapters** that adhere to published government interface schemas. The AI document-intelligence engine is implemented as a simulated service architected to interface with production OCR solutions (e.g. Google Cloud Document AI, AWS Textract, or open-source Tesseract OCR). **AI assists, rules govern, humans decide**—all statutory and financial sanctions are strictly executed by authorized officers.

---

## 📊 Grounded Official Statistics vs Prototype Demonstration Cohort

To maintain absolute credibility and transparent data hygiene, VidyaSetu clearly distinguishes published official MoTA DBT metrics from its synthetic demonstration cohort:

| Metric Category | Metric & Source | Published Value / Scope | Description |
| :--- | :--- | :--- | :--- |
| **Official MoTA DBT** | Pre-Matric ST Scholarship | **28,99,699 Beneficiaries** | Official MoTA published portal figures ([dbttribal.gov.in](https://dbttribal.gov.in/AllScheme.aspx)) |
| **Official MoTA DBT** | Post-Matric ST Scholarship | **65,42,207 Beneficiaries** | Official MoTA published portal figures ([dbttribal.gov.in](https://dbttribal.gov.in/AllScheme.aspx)) |
| **Official MoTA DBT** | Top Class Education ST | **1,000 Sanctioned Slots** | Premier institutions (IITs, IIMs, NITs, AIIMS, NLUs) |
| **Official MoTA DBT** | National Fellowship (NFST) | **750 Sanctioned Slots** | M.Phil and Ph.D. scholars in Indian universities |
| **Official MoTA DBT** | National Overseas Scholarship (NOS) | **20 Sanctioned Slots** | Master's and Ph.D. studies in QS Top 500 universities |
| **Official MoTA DBT** | Cumulative Fellowship DBT Outlays | **₹4,300+ Crores** | Total historical transfers via PFMS |
| **Prototype Demo Cohort** | Synthetic Demonstration Pool | **12,842 Applications** | Synthetic dataset across 36 States/UTs and 75 PVTG communities |
| **Prototype Demo Cohort** | Policy Simulator Pool | **10,000 Records** | Calibrated synthetic cohort for stress-testing rule adjustments |
| **Prototype Demo Cohort** | Disbursal Sandbox Batches | **₹178.4 Crores** | Synthetic PFMS batch simulation pool |

---

## 🤖 4 Core Defensible AI Capabilities

VidyaSetu organizes its artificial intelligence capabilities into 4 modular, explainable services:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        VIDYASETU 4 CORE AI MODULES                                     │
├──────────────────────────┬──────────────────────────┬──────────────────────────────────┤
│ 1. Document Intelligence │ 2. Automated Deficiency  │ 3. Policy Simulator DSS          │
│    & OCR Service         │    & Anomaly Detector    │    (10,000 Synthetic Records)    │
│ • OCR entity extraction  │ • Expired certificate    │ • No-code rule perturbation      │
│ • Digital seal & barcode   lapsed validity alerts   │ • Projected beneficiary delta    │
│ • Name phonetic match    │ • Cross-application dupe │ • Instant budgetary fiscal       │
│ • Article 342 verification phone/bank cluster flag  │   impact delta calculations      │
├──────────────────────────┴──────────────────────────┴──────────────────────────────────┤
│ 4. Multilingual Voice & Text Copilot (VidyaMitra)                                      │
│ • Conversational guidance in 6 scheduled & tribal languages (Santali, Odia, etc.)      │
│ • Speech recognition & voice synthesis for low-literacy applicant accessibility         │
│ • Core Policy: "AI assists. Rules govern. Humans decide."                              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Module 1: Document Intelligence & OCR Service (`documentAI.js`)
* Extracts document attributes: issuing authority, certificate serial number, date of issuance, and candidate name. **In the current prototype, OCR is simulated — real Tesseract OCR integration is in progress (Phase 2).**
* Applies Jaro-Winkler similarity for cross-document name matching (thresholds: ≥0.97 match, 0.85–0.97 → human review, <0.85 → mismatch). This is a prototype implementation; production accuracy depends on document image quality.
* Cross-references applicant community against the **Central Scheduled Tribe list notified under Article 342 of the Constitution of India** (keyword-based in prototype; production would use the official gazette database).

### Module 2: Automated Deficiency & Cross-Application Anomaly Detection
* **Automated Deficiency Detection**: Detects lapsed certificates (e.g. an Income Certificate issued in Jan 2023, exceeding the statutory 1-fiscal-year validity window). Dispatches instant deficiency notices with a 15-day resolution window preserving queue seniority.
* **Cross-Application Anomaly Detection**: Uncovers shared contact numbers, bank accounts, or duplicate identity markers across different applications (e.g. flagging potential fraud rings across state borders).

### Module 3: Policy Simulator Decision Support System (`policySimulator.js`)
* Evaluates proposed policy rule adjustments (raising income ceilings, relaxing marks, adding affirmative PVTG quotas) across a calibrated **synthetic demonstration cohort** (illustrative dataset, not actual MoTA records).
* Delivers instant predictive impact analysis: projected beneficiary deltas, fiscal budget impact (in ₹ Crores), and administrative scrutiny workload changes. **Note: All numbers are model estimates on synthetic data — not actual applicant counts.**

### Module 4: Multilingual Voice & Text Copilot — VidyaMitra (`VidyaMitraChatbot.jsx`)
* Conversational assistant supporting 6 languages: English, हिन्दी (Hindi), ଓଡ଼ିଆ (Odia), ᱥᱟᱱᱛᱟᱲᱤ (Santali - Ol Chiki script), తెలుగు (Telugu), and मराठी (Marathi).
* Speech input relies on the browser's built-in Web Speech API (available in Chrome/Edge; not supported in all environments). Synthesis (text-to-speech) works similarly. These are browser-native APIs, not a deployed ASR service.

---

## ⚖️ Deterministic Governance: "AI Assists, Rules Govern, Humans Decide"

To prevent algorithmic discrimination and ensure strict adherence to Indian administrative law:

1. **AI Assists**: AI extracts text, maps coordinates, identifies expired dates, and flags potential anomalies into triage queues (`READY`, `REVIEW`, `DEFICIENT`).
2. **Rules Govern**: Scheme eligibility is determined **100% deterministically** by statutory rules (`ruleEngine.js`) citing official MoTA guidelines and Article 342. No applicant is ever rejected by an AI probabilistic score.
3. **Humans Decide**: Sanction orders and adverse rejections are strictly executed by designated Ministry Officers on the **Dual-Pane Scrutiny Desk**, with mandatory statutory clause logging for RTI auditability.

---

## ⚡ 7-Minute Golden End-to-End Walkthrough Guide

Follow this curated walkthrough to experience the entire lifecycle of scholar **Birsa Hemrom** (`MOTA-2026-NFST-0101`):

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  STEP 1:     │     │  STEP 2:     │     │  STEP 3:     │     │  STEP 4:     │
│ 30-Sec Pre-  │ ──► │ Launch Demo  │ ──► │ Rectify      │ ──► │ Dual-Pane    │
│ Checker      │     │ Birsa Hemrom │     │ Deficiency   │     │ Officer Desk │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                                       │
┌──────────────┐     ┌──────────────┐     ┌──────────────┐             │
│  STEP 7:     │     │  STEP 6:     │     │  STEP 5:     │             │
│ Award Letter │ ◄── │ SHA-256 Chain│ ◄── │ Policy DSS   │ ◄───────────┘
│ & PFMS DBT   │     │ Verification │     │ 10k Simulator│
└──────────────┘     └──────────────┘     └──────────────┘
```

1. **Step 1: Public Pre-Checker (30 Seconds)**
   * On the Public Home Page ([http://localhost:5173/](http://localhost:5173/)), scroll to **"Check Your Eligibility in 30 Seconds"**.
   * Select Post-Graduation, ₹4,50,000 income, 26 yrs, Ph.D. in India, Santhal.
   * Click **"Evaluate My Statutory Eligibility Now"** ➔ click **"Why am I eligible? 🔍"** to view the deterministic statutory rule breakdown citing Article 342.

2. **Step 2: Launch Golden Demo Candidate (Birsa Hemrom)**
   * Click the hero button: **"🚀 Run 7-Minute Golden Demo (Birsa Hemrom)"**.
   * You are logged in as Birsa Hemrom (`MOTA-2026-NFST-0101`, Ph.D. at IIT Kharagpur, Santhal tribe).
   * Notice status: **"Deficiency Pending"** with an active alert banner indicating an expired Income Certificate (issued Jan 2023, >1 yr old).
   * Inspect the **End-to-End Application Lifecycle Tracker** and the **Statutory Rules Compliance Card**.

3. **Step 3: Resolve Deficiency via AI Re-Scan**
   * Click the red **"Rectify & Re-Upload"** button (or navigate to the **Deficiency Desk** tab).
   * Review the Scrutiny Officer's observation.
   * Click the upload box to load `Fresh_Income_Certificate_FY2026_27_SDO_Ranchi.pdf`.
   * Watch the AI re-scan validate the SDO barcode, 100% name match, and FY 2026-27 validity.
   * Click **"Submit Rectified Document to MoTA Desk"**.
   * State transitions immediately to: **`STATUS: READY FOR HUMAN REVIEW`**.

4. **Step 4: Ministry Officer Scrutiny Desk (Application X-Ray)**
   * Click **"Switch to Ministry Officer Scrutiny Desk (Dual-Pane Workstation) ➔"** (or click the hero button `🛡️ Ministry Officer Scrutiny Login` / header toggle `Officer Desk ➔`).
   * Select Birsa Hemrom (`MOTA-2026-NFST-0101`) in the queue.
   * **Left Pane**: Observe that all deterministic rules (ST status Article 342, income, age, degree) now show **PASS**.
   * **Right Pane**: Inspect the Income Certificate canvas with the green OCR bounding box and extracted entity table.
   * Click **"Approve Application"** to forward to the Selection Committee (or inspect the **Human Officer Override** and **Statutory Rejection** modals).

5. **Step 5: Scheme Configuration Studio & 10,000 Synthetic Applications Simulator**
   * In the top admin bar, click **"Scheme Config & 10k Simulator"**.
   * View all 5 official MoTA schemes (Pre-Matric, Post-Matric, Top Class, NFST, NOS).
   * Switch to the **Policy Sandbox** tab.
   * Click **"Simulate on 10,000 Synthetic Applications"** to observe real-time projected beneficiary deltas (+680 scholars) and budget impact (+₹25.16 Cr).

6. **Step 6: Verify Tamper-Evident SHA-256 Chained Audit Trail**
   * In the admin bar, click **"AI Triage & Priority Desk"** (or click Audit Trail on any student card).
   * Open Birsa Hemrom's **Tamper-Evident Audit Trail**.
   * Click **"Verify Hash Chain Integrity"** ➔ observe cryptographic validation confirming all blocks are linked without tampering.
   * Click **"Simulate Tamper Attack (Test)"** ➔ observe instant detection of altered block hash and broken chain pointer.
   * Click **"Restore Original Audit Chain"** to return to integrity.

7. **Step 7: Award Letter & PFMS DBT Sandbox Hub**
   * In the admin bar, click **"Merit & Quota Engine"** and click **"Generate Official Gazette & Sanction Award Letters"**.
   * View Birsa's official Award Letter with digitally signed credentials and prototype QR registry verification.
   * Switch to **"Post-Selection & DBT Hub"** to view quarterly progress report (QPR) compliance and simulated PFMS e-FTO disbursement batches.

---

## 🏗️ Technical Architecture & Repository Structure

VidyaSetu is built on a **modular, service-oriented prototype architecture designed for event-driven production deployment**:

```
VidyaSetu/
├── backend/
│   ├── server.js                     # Zero-dependency Node.js HTTP/REST server (Port 5001)
│   ├── services/
│   │   ├── ruleEngine.js             # Pure deterministic statutory evaluation engine (Article 342)
│   │   ├── auditChain.js            # SHA-256 cryptographic block chaining & verification
│   │   ├── documentAI.js            # OCR entity extraction, date check & re-scan service
│   │   └── policySimulator.js       # 10,000-record synthetic policy DSS simulator
│   └── data/
│       └── db.js                     # In-memory database with 5 MoTA schemes & applicants
├── src/
│   ├── components/
│   │   ├── PublicHomePage.jsx        # Citizen home page, 30-sec pre-checker & "Why?" modal
│   │   ├── Header.jsx                # Gov of India header, accessibility & role quick-toggle
│   │   ├── AuditTrailModal.jsx       # Interactive SHA-256 chain integrity validator
│   │   ├── AwardLetterModal.jsx      # Sanction award letter with prototype QR verification
│   │   ├── VidyaMitraChatbot.jsx     # Multilingual voice/text conversational AI copilot
│   │   └── LoginPanel.jsx            # Citizen / Officer Jan Parichay authentication
│   ├── portals/
│   │   ├── ApplicantPortal/          # Scholar dashboard, wizard, deficiency desk, QPR
│   │   └── AdminPortal/              # Scrutiny desk, triage, merit engine, policy simulator
│   ├── services/
│   │   └── apiClient.js              # REST client with automatic fallback for static hosting
│   └── data/
│       ├── mockData.js               # Initial applicants, 5 schemes, and tribal communities
│       └── i18n.js                   # Multilingual dictionary (6 official & tribal languages)
├── SYSTEM_ARCHITECTURE.md            # Comprehensive technical architecture specification
├── DEPLOYMENT.md                     # Production deployment manual (Cloud & Docker)
└── package.json                      # Project dependencies and operational scripts
```

---

## 🚀 Getting Started & Local Installation

### Prerequisites
* **Node.js**: v18.0 or higher (v24.x tested and supported)
* **npm**: v9.0 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/aditisinha17/VidyaSetu.git
cd VidyaSetu
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Complete Platform (Backend + Frontend)

**Terminal 1 — Start the Backend Service:**
```bash
npm run backend
```
*Starts the VidyaSetu Governance API server at `http://localhost:5001`.*

**Terminal 2 — Start the Vite Development Server:**
```bash
npm run dev
```
*Opens the VidyaSetu application at `http://localhost:5173`.*

### 4. Build for Production
```bash
npm run build
```
*Generates optimized production assets in `dist/`.*

---

## 🌐 Multilingual Accessibility & Tribal Inclusion (GIGW 2.0)

VidyaSetu is designed from the ground up for equitable access across remote tribal belts:
* **6 Supported Languages**: English, हिन्दी (Hindi), ଓଡ଼ିଆ (Odia), ᱥᱟᱱᱛᱟᱲᱤ (Santali - Ol Chiki script), తెలుగు (Telugu), and मराठी (Marathi).
* **Low-Bandwidth 2G Mode**: Eliminates heavy graphics and compresses UI payloads for scholars in remote tribal areas.
* **Accessibility Controls**: Targeting WCAG 2.1 AA guidelines: high-contrast theme and font size scaling ($A$ / $A+$). Not independently audited for full compliance.
* **Screen Reader & Speech Support**: Multilingual speech recognition and synthesis via the **VidyaMitra** copilot.

---

## 📜 Compliance, Integrity & Legal Framework

* **Constitutional Grounding**: Implements statutory reservation rules under Article 342 of the Constitution of India and official Central/State notified ST gazette lists.
* **Explainable Decisions**: RTI-friendly decision records with deterministic rule audit trails ensure that administrative discretion is transparent and auditable.
* **Zero Adverse Automated Decisions**: AI performs entity extraction, validation flagging, and triage prioritization; adverse decisions require statutory clause citations by authorized human officers.

---

## ✅ What Is Real vs. Simulated

This prototype is built for SIH 2026. Being honest about what works and what is simulated is a requirement of good engineering:

| Feature | Status | Notes |
|:---|:---|:---|
| **Rule engine** | ✅ Real | Generic deterministic engine evaluates all scheme rules from config data. No hardcoded `if (scheme.id === 'NOS')` branches (as of Phase 1). |
| **Scheme configuration** | ✅ Real | SchemeConfigStudio saves via `PUT /api/schemes/:id` to the in-memory backend. Changes affect subsequent rule evaluations. |
| **OCR / document reading** | 🔶 Simulated (Phase 2 in progress) | Tesseract.js integration is being added. Current version classifies by filename keywords and returns extracted fields from simulated results. |
| **Jaro-Winkler name matching** | ✅ Real | Pure-JS implementation with no dependency; used for cross-document consistency checks. |
| **Audit chain (SHA-256)** | ✅ Real | `auditChain.js` uses Node.js `crypto` — each block hash is cryptographically chained. Pre-seeded blocks in demo data use consistent timestamps and actual hash chains. |
| **Policy simulator** | 🔶 Model-based | Runs a statistical model on a synthetic distribution, not on real applicant records. All numbers are illustrative. |
| **PFMS / DBT disbursement** | 🔶 Sandbox | No real money moves. All PFMS batch IDs and UTRs are sandbox placeholders. |
| **DigiLocker / Aadhaar KYC** | 🔶 Sandbox adapter | Simulated flow. No real DigiLocker API calls in the prototype. |
| **Backend API** | ✅ Real | Zero-dependency Node.js server running on port 5001. Real HTTP routing, real JSON. |
| **Eligibility API** | ✅ Real | `POST /api/eligibility/check` runs the actual rule engine against the scheme config. |
| **NOS income ceiling** | ✅ Corrected | ₹6,00,000 (corrected from ₹8L — confirmed: tribal.nic.in, pib.gov.in). |
| **NOS QS rank threshold** | ✅ Corrected | 1,000 (corrected from 500 — confirmed: tribal.nic.in 2024-25 guidelines). |
| **WCAG 2.1 AA** | 🔶 Targeted | High-contrast mode and font scaling implemented; not independently audited. |
| **Speech recognition** | 🔶 Browser API | Uses browser's native Web Speech API — available in Chrome/Edge only. Not a deployed ASR service. |

### API Endpoints (Backend Port 5001)
```
GET  /api/health                                   Backend health & adapter status
GET  /api/stats/mota-dbt                           Official MoTA DBT stats
GET  /api/schemes                                  All 5 scheme configs
PUT  /api/schemes/:schemeId                        Update scheme config (admin only)
POST /api/eligibility/check                        Run rule engine for a candidate
GET  /api/applications                             All applications
GET  /api/applications/:appId                      Single application
POST /api/applications/:appId/documents/replace    Replace a deficient document
POST /api/applications/:appId/scrutiny/approve     Officer approval action
POST /api/applications/:appId/scrutiny/override    Officer override with audit log
GET  /api/audit/:appId/verify                      SHA-256 chain verification
POST /api/policy/simulate                          Policy simulation on synthetic pool
GET  /api/anomalies                                Cross-application anomaly clusters
POST /api/documents/analyze                        Upload & analyze a document (Phase 2)
```

### Running the Demo with Sample Files (Phase 2+)
```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Start backend
npm run backend
# → API live at http://localhost:5001/api

# 4. Start frontend
npm run dev
# → UI live at http://localhost:5173

# 5. Use the sample documents in /samples:
#    valid_income_certificate.pdf       → VERIFIED
#    expired_income_certificate.pdf     → DEFICIENT (DEF-INC-EXPIRED)
#    name_mismatch_certificate.pdf      → MEDIUM RISK (name ≠ application)
#    low_quality_certificate.png        → MEDIUM RISK (low OCR confidence)
#    st_certificate_matching.pdf        → VERIFIED
#    marksheet_matching.pdf             → VERIFIED
```

---

## 👥 Contributors & Acknowledgements

* **Team VidyaSetu** — Smart India Hackathon (SIH) 2026 (Problem Statement 239)
* **Ministry of Tribal Affairs (MoTA)**, Government of India
* Official References: [tribal.nic.in/ScholarshiP.aspx](https://tribal.nic.in/ScholarshiP.aspx) | [dbttribal.gov.in/AllScheme.aspx](https://dbttribal.gov.in/AllScheme.aspx)
