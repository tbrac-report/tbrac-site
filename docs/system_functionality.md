# TBRAC System Functionality Summary

**Trans-Border Risk Assessment & Certification**
Assurance Pacific Assessments LLC

---

## What Is TBRAC?

TBRAC is a compliance intelligence platform designed to help international companies — primarily Chinese enterprises — assess their readiness to enter the U.S. market. It provides a structured, evidence-based evaluation across ten risk dimensions, producing a scored risk profile and formal certification.

The platform serves two types of users:
- **Company Users** — representatives of companies seeking U.S. market entry who complete the self-assessment
- **Evaluators** — internal analysts at Assurance Pacific who review submitted assessments

---

## Core Functions

### 1. Company Onboarding

Companies register via email and create a detailed profile capturing:

| Field | Options |
|---|---|
| Company Name (EN + ZH) | Free text |
| Industry Sector | Technology, Semiconductors, Defense, Healthcare, Clean Energy, Financial Services, Consumer Goods, Manufacturing, Telecommunications, Real Estate, Agriculture, Other |
| Ownership Type | Private, State-Owned Enterprise, Mixed Ownership, Publicly Listed, Joint Venture |
| State Ownership % | Numeric (if applicable) |
| Headquarters | Country + City |
| U.S. Presence | Description of existing U.S. operations |
| U.S. Subsidiary | Name (if any) |
| Website | URL |

### 2. Ten-Module Risk Assessment

The assessment framework evaluates companies across ten risk dimensions. Each module contains ten scored criteria (questions). Users respond using a 0–10 slider for each criterion:
- **0** = High risk / non-compliant
- **10** = Low risk / fully compliant

| # | Module | Focus Area |
|---|---|---|
| 1 | Regulatory Scrutiny | CFIUS reviews, export controls, entity list status, sector licensing |
| 2 | Political & Geopolitical Risk | Sanctions, bilateral climate, legislative threats, lobbying transparency |
| 3 | IP Protection | U.S. patent portfolio, trademark defense, litigation history |
| 4 | Data Security & Privacy | CCPA/CPRA, data localization, NIST framework, breach protocols |
| 5 | Reputational Risk | Media sentiment, consumer trust, CSR programs, crisis management |
| 6 | Market Access | Tariff impact, non-tariff barriers, distribution channels, compliance costs |
| 7 | Supply Chain | Origin traceability, forced labor compliance (UFLPA), supplier diversification |
| 8 | Financial & Economic Risks | Currency hedging, PCAOB audit compliance, SEC readiness |
| 9 | National Security | Dual-use technology, critical infrastructure proximity, technology transfer |
| 10 | Corporate Governance | Board independence, audit transparency, HFCAA compliance, shareholder rights |

### 3. Document Vault

Each module includes a dedicated document vault. Companies upload supporting evidence (PDFs, certificates, reports) that substantiate their self-assessment responses. Recommended document types are shown for each module (e.g., CFIUS filing records, PCAOB-audited financials, UFLPA compliance documentation).

### 4. Automated Scoring & Risk Classification

As each module is completed, the system automatically calculates scores. When all ten modules are finished, the platform computes an overall risk score and assigns one of four risk tiers:

| Risk Tier | Score Range | Color |
|---|---|---|
| Low | 0–30 | Green |
| Medium | 31–50 | Yellow |
| High | 51–70 | Orange |
| Very High | 71–100 | Red |

### 5. Assessment Submission & Certification

Once all modules are complete, the company submits the assessment. The system:
- Locks the assessment against further edits
- Records submission timestamp
- Generates a unique certificate number (`TBRAC-YYYYMM-{id}`)
- Makes the assessment available to the Evaluator Portal

### 6. Evaluator Review Portal

Evaluators access a separate authenticated portal to:
- View all submitted assessments
- Review company profiles and uploaded documents
- Examine module-by-module scores and responses
- Add analyst notes
- Generate and download the formal assessment report (PDF)

### 7. Report Generation

The platform generates a formal assessment report containing:
- Official TBRAC certificate with overall score and risk level
- Company information summary
- Module-by-module risk breakdown with scores and badges
- Key strengths identified
- Areas requiring attention
- Expert recommendations
- Assessment methodology statement
- Certificate number for verification

---

## Technical Highlights

| Aspect | Detail |
|---|---|
| Bilingual | All 100 assessment questions available in English and Simplified Chinese |
| Secure Authentication | Supabase Auth with JWT verification (ES256 + HS256 fallback) |
| Document Storage | Google Cloud Storage (S3-compatible API) |
| API | RESTful FastAPI backend with async SQLAlchemy ORM |
| Frontend | Next.js 16 with React 19, Tailwind CSS, shadcn/ui components |
| Data Isolation | Each company user accesses only their own data |
| Production Infrastructure | GCP Cloud Run (backend) + Vercel (frontend) |

---

## User Journey Summary

```
Register / Log In
       ↓
Create Company Profile
       ↓
Start New Assessment (10 modules auto-created)
       ↓
For each of 10 modules:
  • Answer 10 criteria using sliders (0–10)
  • Upload supporting documents
  • Mark module complete → score calculated
       ↓
All 10 modules done → Overall risk score computed
       ↓
Submit Assessment → Locked & certified
       ↓
Evaluator reviews → Formal report generated
```

---

*TBRAC is operated by Assurance Pacific Assessments LLC. All assessments are confidential.*
