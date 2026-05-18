# TBRAC Scoring Model: Scores, Risk Levels, and Assessment Output

---

## Overview

The TBRAC scoring model translates a company's self-assessed compliance across ten risk dimensions into a single, standardized Risk Score (0–100) and a Risk Tier classification. Higher scores indicate greater risk exposure to U.S. market entry barriers.

---

## Step 1 — Criterion-Level Scoring

Each of the ten modules contains exactly ten assessment criteria (questions). For every criterion, the company provides a response using a **0–10 scale**:

| Score | Meaning |
|---|---|
| **0** | Highest risk / fully non-compliant |
| **5** | Moderate risk / partial compliance |
| **10** | Lowest risk / fully compliant |

Anchors at each end of the scale define the best and worst cases for that specific criterion. For example:

> **Module 1, Criterion 3 — Entity List / Sanctions Status**
> - `0` anchor: *"Listed on SDN or MEU list"*
> - `10` anchor: *"No exposure to any restricted list"*

---

## Step 2 — Module Score Calculation

Each module's score is the **sum** of its ten criterion scores:

```
Module Score = Q1 + Q2 + Q3 + Q4 + Q5 + Q6 + Q7 + Q8 + Q9 + Q10
```

**Range:** 0–100 per module
- `0` = maximum risk (all criteria scored 0)
- `100` = minimum risk (all criteria scored 10)

### Example: Module 4 — Data Security & Privacy

| Criterion | Response |
|---|---|
| CCPA/CPRA Compliance | 8 |
| Breach Notification Protocol | 7 |
| Data Localization | 9 |
| Cybersecurity Framework (NIST) | 6 |
| Vendor / Third-Party Risk | 7 |
| User Consent Management | 8 |
| Forced Disclosure Risk | 5 |
| Encryption Standards | 9 |
| Employee Security Training | 7 |
| Incident Response | 6 |
| **Module 4 Score** | **72 / 100** |

---

## Step 3 — Total Risk Score Calculation

The total risk score converts the ten module compliance scores into a single **risk** metric. Because module scores measure compliance (higher = safer), the total score **inverts** this direction so that a higher total score signals greater overall risk.

```
Total Risk Score = 100 − round( sum of all module scores ÷ 10 )
```

This formula always divides by 10 (the fixed total number of modules), meaning partial assessments produce comparable intermediate scores.

**Range:** 0–100
- `0` = minimum risk (all modules scored 100)
- `100` = maximum risk (all modules scored 0)

### Full Assessment Example

| Module | Score |
|---|---|
| 1. Regulatory Scrutiny | 62 |
| 2. Political & Geopolitical Risk | 55 |
| 3. IP Protection | 70 |
| 4. Data Security & Privacy | 72 |
| 5. Reputational Risk | 80 |
| 6. Market Access | 58 |
| 7. Supply Chain | 65 |
| 8. Financial & Economic Risks | 60 |
| 9. National Security | 48 |
| 10. Corporate Governance | 74 |
| **Sum of Module Scores** | **644** |

```
Total Risk Score = 100 − round( 644 ÷ 10 )
                = 100 − round( 64.4 )
                = 100 − 64
                = 36
```

**Total Risk Score: 36 / 100 → MEDIUM RISK**

---

## Step 4 — Risk Tier Assignment

The total risk score is mapped to one of four risk tiers:

| Risk Tier | Score Range | Color Code | Interpretation |
|---|---|---|---|
| **Low** | 0–30 | Green | Strong compliance posture; minimal barriers to U.S. market entry |
| **Medium** | 31–50 | Yellow | Notable risk areas identified; targeted remediation recommended |
| **High** | 51–70 | Orange | Significant compliance gaps; substantial preparation required |
| **Very High** | 71–100 | Red | Critical deficiencies; market entry faces major regulatory obstacles |

### Logic (from backend):
```python
RISK_TIERS = [
    (30,  "low"),
    (50,  "medium"),
    (70,  "high"),
    (100, "very_high"),
]

def _calculate_risk_tier(score: int) -> str:
    for threshold, tier in RISK_TIERS:
        if score <= threshold:
            return tier
    return "very_high"
```

---

## Assessment Output

When all ten modules are completed and submitted, the assessment output includes:

### 1. Certificate
- Company name
- Overall Risk Score (e.g., `36/100`)
- Risk Level label (e.g., `Medium Risk`)
- Unique Certificate Number: `TBRAC-YYYYMM-{assessment_id}`
- Issue date

### 2. Module Breakdown
For each of the ten modules:
- Module name
- Module score (0–100)
- Risk badge (Low / Medium / High / Very High)

### 3. Narrative Analysis
- **Key Strengths** — modules or criteria where the company demonstrates strong compliance
- **Areas Requiring Attention** — modules or criteria with the lowest scores
- **Expert Recommendations** — actionable steps to reduce risk exposure

### 4. Supporting Data
All uploaded documents from the Document Vault are associated with each module and available for evaluator review.

---

## Scoring Properties

| Property | Value |
|---|---|
| Questions per module | 10 |
| Total questions | 100 |
| Per-question range | 0–10 |
| Per-module range | 0–100 |
| Total risk score range | 0–100 |
| Score direction | Higher = more risk |
| Module score direction | Higher = less risk (compliant) |
| Divisor always | 10 (fixed, regardless of modules completed) |

---

## Partial Assessment Behavior

If a company completes fewer than ten modules, the system calculates an intermediate total score using the same formula (dividing by 10). This means:
- A company that completes only 5 modules with average score 60 per module: `100 − (300 ÷ 10) = 70 → High Risk`
- Incomplete modules contribute 0 to the sum, which biases the intermediate score toward higher risk — correctly reflecting incomplete compliance evidence.

This design ensures the assessment always produces a comparable, meaningful score at any stage of completion.
