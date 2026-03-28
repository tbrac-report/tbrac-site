export type SubmissionStatus = "pending_review" | "under_review" | "approved" | "changes_requested" | "completed"

export interface AssessmentResult {
  overallScore: number
  overallRiskLevel: "low" | "medium" | "high" | "critical"
  categoryScores: Array<{
    categoryId: string
    categoryName: string
    score: number
    maxScore: number
    riskLevel: "low" | "medium" | "high" | "critical"
  }>
  completionPercentage: number
  recommendations: string[]
  strengths: string[]
  concerns: string[]
}

export interface Submission {
  id: string
  companyInfo: Record<string, string>
  responses: Record<string, unknown>
  result: AssessmentResult
  submittedAt: string
  status: SubmissionStatus
  assignedEvaluator?: string
  evaluatorNotes?: EvaluatorNote[]
  finalScore?: number
  certificateIssued?: boolean
  lastUpdated: string
}

export interface EvaluatorNote {
  id: string
  evaluatorName: string
  categoryId?: string
  note: string
  createdAt: string
  type: "comment" | "concern" | "approval"
}

export interface Evaluator {
  id: string
  name: string
  email: string
  specialization: string[]
  assignedSubmissions: number
}
