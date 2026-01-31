import type { Submission } from "./evaluator-types"
import { ASSESSMENT_CATEGORIES } from "./assessment-data"

export interface ReportData {
  submission: Submission
  generatedDate: string
  certificateNumber: string
  evaluatorSignature?: string
}

export function generateCertificateNumber(submissionId: string): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  return `TBRAC-${year}${month}-${submissionId}`
}

export function formatReportDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function generateReportHTML(reportData: ReportData): string {
  const { submission, generatedDate, certificateNumber } = reportData
  const score = Math.round(submission.result.overallScore)

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TBRAC Report - ${submission.companyInfo.companyName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Georgia', serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: white;
      padding: 40px;
    }
    .container { max-width: 800px; margin: 0 auto; }
    .header {
      text-align: center;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 30px;
      margin-bottom: 40px;
    }
    .logo { font-size: 32px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
    .subtitle { font-size: 18px; color: #64748b; }
    .certificate-box {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      color: white;
      padding: 40px;
      border-radius: 10px;
      text-align: center;
      margin: 40px 0;
    }
    .certificate-title { font-size: 28px; font-weight: bold; margin-bottom: 20px; }
    .company-name { font-size: 36px; font-weight: bold; margin: 20px 0; }
    .score-display {
      font-size: 72px;
      font-weight: bold;
      margin: 30px 0;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
    .score-label { font-size: 20px; opacity: 0.9; }
    .section { margin: 40px 0; }
    .section-title {
      font-size: 24px;
      font-weight: bold;
      color: #2563eb;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 15px;
      margin: 20px 0;
    }
    .info-label { font-weight: bold; color: #64748b; }
    .category-score {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 10px;
    }
    .category-name { font-weight: 600; }
    .category-value {
      font-size: 20px;
      font-weight: bold;
      color: #2563eb;
    }
    .risk-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-left: 10px;
    }
    .risk-low { background: #dcfce7; color: #166534; }
    .risk-medium { background: #fef9c3; color: #854d0e; }
    .risk-high { background: #fed7aa; color: #9a3412; }
    .risk-critical { background: #fee2e2; color: #991b1b; }
    .recommendations {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #2563eb;
    }
    .recommendation-item {
      margin: 15px 0;
      padding-left: 30px;
      position: relative;
    }
    .recommendation-item::before {
      content: "→";
      position: absolute;
      left: 0;
      color: #2563eb;
      font-weight: bold;
    }
    .footer {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #64748b;
      font-size: 14px;
    }
    .certificate-number {
      font-family: 'Courier New', monospace;
      font-weight: bold;
      color: #2563eb;
      margin: 20px 0;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo">🌐 TBRAC Reports</div>
      <div class="subtitle">Trans-Border Risk Assessment and Certification</div>
      <div class="subtitle" style="margin-top: 10px;">Property of Assurance Pacific Assessments LLC</div>
    </div>

    <!-- Certificate Section -->
    <div class="certificate-box">
      <div class="certificate-title">OFFICIAL ASSESSMENT CERTIFICATE</div>
      <div>This certifies that</div>
      <div class="company-name">${submission.companyInfo.companyName}</div>
      <div>has completed the TBRAC assessment with an overall score of</div>
      <div class="score-display">${score}/100</div>
      <div class="score-label">Risk Level: ${getRiskLevelText(submission.result.overallRiskLevel)}</div>
      <div class="certificate-number" style="margin-top: 30px;">Certificate No: ${certificateNumber}</div>
      <div style="opacity: 0.9;">Issued: ${formatReportDate(generatedDate)}</div>
    </div>

    <!-- Company Information -->
    <div class="section">
      <div class="section-title">Company Information</div>
      <div class="info-grid">
        <div class="info-label">Company Name:</div>
        <div>${submission.companyInfo.companyName}</div>
        
        <div class="info-label">Country of Origin:</div>
        <div>${submission.companyInfo.countryOfOrigin}</div>
        
        <div class="info-label">Industry:</div>
        <div>${submission.companyInfo.industry}</div>
        
        <div class="info-label">Company Size:</div>
        <div>${submission.companyInfo.companySize}</div>
        
        <div class="info-label">Contact Person:</div>
        <div>${submission.companyInfo.contactName}</div>
        
        <div class="info-label">Assessment Date:</div>
        <div>${formatReportDate(submission.submittedAt)}</div>
      </div>
    </div>

    <!-- Category Breakdown -->
    <div class="section">
      <div class="section-title">Category Risk Assessment</div>
      ${submission.result.categoryScores
        .map(
          (cat) => `
        <div class="category-score">
          <div>
            <span class="category-name">${cat.categoryName}</span>
            <span class="risk-badge risk-${cat.riskLevel}">${getRiskLevelText(cat.riskLevel)}</span>
          </div>
          <div class="category-value">${Math.round(cat.score)}/100</div>
        </div>
      `,
        )
        .join("")}
    </div>

    <!-- Strengths -->
    ${
      submission.result.strengths.length > 0
        ? `
    <div class="section">
      <div class="section-title">Key Strengths</div>
      <div class="recommendations">
        ${submission.result.strengths
          .map(
            (strength) => `
          <div class="recommendation-item">${strength}</div>
        `,
          )
          .join("")}
      </div>
    </div>
    `
        : ""
    }

    <!-- Concerns -->
    ${
      submission.result.concerns.length > 0
        ? `
    <div class="section">
      <div class="section-title">Areas Requiring Attention</div>
      <div class="recommendations">
        ${submission.result.concerns
          .map(
            (concern) => `
          <div class="recommendation-item">${concern}</div>
        `,
          )
          .join("")}
      </div>
    </div>
    `
        : ""
    }

    <!-- Recommendations -->
    <div class="section">
      <div class="section-title">Expert Recommendations</div>
      <div class="recommendations">
        ${submission.result.recommendations
          .map(
            (rec, idx) => `
          <div class="recommendation-item">${idx + 1}. ${rec}</div>
        `,
          )
          .join("")}
      </div>
    </div>

    <!-- Disclaimer -->
    <div class="section">
      <div class="section-title">Assessment Methodology</div>
      <p style="color: #64748b; line-height: 1.8;">
        This Trans-Border Risk Assessment and Certification (TBRAC) evaluates organizations across 10 
        comprehensive risk categories including regulatory scrutiny, political and geopolitical risk, 
        data security and privacy, intellectual property protection, reputational risk, national security 
        concerns, supply chain transparency, market competition behavior, labor practices, and environmental 
        and social governance. The assessment is conducted by domain experts with extensive experience in 
        cross-border market entry and regulatory compliance.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>Assurance Pacific Assessments LLC</strong></p>
      <p>Expert Cross-Border Risk Assessment Services</p>
      <p style="margin-top: 10px;">This is an official TBRAC certification document.</p>
      <p>For verification, contact: verify@assurancepacific.com</p>
    </div>
  </div>
</body>
</html>
  `
}

function getRiskLevelText(riskLevel: string): string {
  switch (riskLevel) {
    case "low":
      return "Low Risk"
    case "medium":
      return "Medium Risk"
    case "high":
      return "High Risk"
    case "critical":
      return "Critical Risk"
    default:
      return riskLevel
  }
}

export function downloadReport(html: string, filename: string) {
  // Create a blob with the HTML content
  const blob = new Blob([html], { type: "text/html" })
  const url = URL.createObjectURL(blob)

  // Create a temporary link and trigger download
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up the URL
  URL.revokeObjectURL(url)
}

export function exportToJSON(submission: Submission): string {
  return JSON.stringify(submission, null, 2)
}

export function downloadJSON(data: string, filename: string) {
  const blob = new Blob([data], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

export function exportToCSV(submission: Submission): string {
  let csv = "Category,Subcategory,Question,Answer,Score\n"

  ASSESSMENT_CATEGORIES.forEach((category) => {
    const categoryScore = submission.result.categoryScores.find((cs) => cs.categoryId === category.id)

    category.subcategories.forEach((subcategory) => {
      subcategory.questions.forEach((question) => {
        const answer = submission.responses[question.id]
        const answerStr = answer !== undefined ? String(answer).replace(/,/g, ";") : "Not answered"

        csv += `"${category.name}","${subcategory.name}","${question.text.replace(/"/g, '""')}","${answerStr}","${categoryScore ? Math.round(categoryScore.score) : 0}"\n`
      })
    })
  })

  return csv
}

export function downloadCSV(data: string, filename: string) {
  const blob = new Blob([data], { type: "text/csv" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
