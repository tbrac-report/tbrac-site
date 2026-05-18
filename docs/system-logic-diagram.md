# TBRAC System Logic Structure

## End-to-End Data Flow

```mermaid
flowchart TD
    A([User: Company Representative]) --> B[Sign Up / Log In\nSupabase Auth]
    B --> C[Create Company Profile\nName · Industry · Ownership · HQ · U.S. Presence]
    C --> D[Create Assessment\nPOST /api/v1/assessments]
    D --> E{10 Module Rows Auto-Initialized\nstatus: not_started · responses: empty}

    E --> F1[Module 1\nRegulatory Scrutiny]
    E --> F2[Module 2\nPolitical & Geopolitical Risk]
    E --> F3[Module 3\nIP Protection]
    E --> F4[Module 4\nData Security & Privacy]
    E --> F5[Module 5\nReputational Risk]
    E --> F6[Module 6\nMarket Access]
    E --> F7[Module 7\nSupply Chain]
    E --> F8[Module 8\nFinancial & Economic Risks]
    E --> F9[Module 9\nNational Security]
    E --> F10[Module 10\nCorporate Governance]

    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 --> G

    G[Answer 10 Questions per Module\nSlider: 0–10 per criterion] --> H[Upload Supporting Documents\nDocument Vault per Module]
    H --> I{Mark Module Complete?}
    I -- Save Draft --> G
    I -- Complete --> J[Calculate Module Score\nsum of 10 responses = 0–100]
    J --> K{All 10 Modules Completed?}
    K -- No --> G
    K -- Yes --> L[Calculate Total Risk Score\n100 − mean of module scores]
    L --> M[Assign Risk Tier\n≤30 Low · 31–50 Medium · 51–70 High · 71–100 Very High]
    M --> N[Assessment status → completed]
    N --> O[Submit Assessment\nPOST /api/v1/assessments/id/submit]
    O --> P[Generate Assessment Certificate\nTBRAC-YYYYMM-id]
    P --> Q([Evaluator Review\nEvaluator Portal])
```

---

## Scoring Sub-Flow

```mermaid
flowchart LR
    subgraph Per Module [Per Module  0–100]
        Q1[Q1: 0–10] & Q2[Q2: 0–10] & Q3[Q3: 0–10] & Q4[Q4: 0–10] & Q5[Q5: 0–10]
        Q6[Q6: 0–10] & Q7[Q7: 0–10] & Q8[Q8: 0–10] & Q9[Q9: 0–10] & Q10[Q10: 0–10]
        Q1 & Q2 & Q3 & Q4 & Q5 & Q6 & Q7 & Q8 & Q9 & Q10 --> MS[Module Score\n= sum Q1…Q10]
    end

    subgraph Total Risk [Total Risk Score  0–100]
        MS --> TS[Total Score\n= 100 − mean of all module scores]
        TS --> RT{Risk Tier}
        RT --> |score ≤ 30| Low[LOW]
        RT --> |31–50| Med[MEDIUM]
        RT --> |51–70| High[HIGH]
        RT --> |71–100| VH[VERY HIGH]
    end
```

---

## System Architecture Components

```mermaid
graph TB
    subgraph Frontend [Next.js 16 — Vercel]
        LP[Landing Page] --> CL[Company Login\nSupabase Auth]
        CL --> DB[Company Dashboard\n/customers/id]
        DB --> AM[Assessment Module UI\n10 sliders + document vault]
        AM --> AR[Assessment Results\nScores + Risk Badge]
        EL[Evaluator Login] --> ED[Evaluator Dashboard\nSubmission Review]
    end

    subgraph Backend [FastAPI — GCP Cloud Run]
        direction TB
        RT[Routers\n/customers · /assessments] --> SVC[Services\nAssessmentService]
        SVC --> SCORE[Scoring Engine\nmodule score · total score · risk tier]
        SVC --> ORM[SQLAlchemy ORM]
    end

    subgraph Storage [Supabase + GCS]
        DB2[(PostgreSQL\nCustomers · Assessments · Modules)]
        GCS[(Google Cloud Storage\nDocument Files)]
    end

    subgraph Auth [Supabase Auth]
        JWT[JWT — ES256 / HS256]
    end

    AM -->|REST API + JWT| RT
    ORM --> DB2
    AM -->|File Upload| GCS
    CL -->|Auth Tokens| JWT
    JWT -->|Verified by| RT
```

---

## Key Invariants

| Rule | Detail |
|---|---|
| One customer per user | Each sign-up creates exactly one customer record |
| 10 modules per assessment | All initialized at creation; cannot add or remove |
| Questions scored 0–10 | 0 = worst risk, 10 = best compliance |
| Module score range | 0–100 (sum of 10 questions) |
| Total score direction | Higher = more risk (inverted from module compliance score) |
| Assessment locked on submit | No edits after `status: submitted` |
| Migrations on startup | `alembic upgrade head` runs before gunicorn in production |
