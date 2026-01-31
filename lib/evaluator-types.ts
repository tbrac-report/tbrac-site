import type { AssessmentResult } from "./scoring"
import type { CompanyInfo, AssessmentResponses } from "./assessment-schema"

export type SubmissionStatus = "pending_review" | "under_review" | "approved" | "changes_requested" | "completed"

export interface Submission {
  id: string
  companyInfo: CompanyInfo
  responses: AssessmentResponses
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
