// Scoring is now handled server-side. This file provides legacy type helpers only.

export interface CategoryScore {
  categoryId: string
  categoryName: string
  score: number
  maxScore: number
  subcategoryScores: SubcategoryScore[]
  riskLevel: "low" | "medium" | "high" | "critical"
}

export interface SubcategoryScore {
  subcategoryId: string
  subcategoryName: string
  score: number
  maxScore: number
}

export interface AssessmentResult {
  overallScore: number
  overallRiskLevel: "low" | "medium" | "high" | "critical"
  categoryScores: CategoryScore[]
  completionPercentage: number
  recommendations: string[]
  strengths: string[]
  concerns: string[]
}

export function getRiskLevelColor(riskLevel: "low" | "medium" | "high" | "critical"): string {
  switch (riskLevel) {
    case "low":     return "text-green-600 dark:text-green-400"
    case "medium":  return "text-yellow-600 dark:text-yellow-400"
    case "high":    return "text-orange-600 dark:text-orange-400"
    case "critical":return "text-red-600 dark:text-red-400"
  }
}

export function getRiskLevelBgColor(riskLevel: "low" | "medium" | "high" | "critical"): string {
  switch (riskLevel) {
    case "low":     return "bg-green-100 dark:bg-green-950"
    case "medium":  return "bg-yellow-100 dark:bg-yellow-950"
    case "high":    return "bg-orange-100 dark:bg-orange-950"
    case "critical":return "bg-red-100 dark:bg-red-950"
  }
}

export function getRiskLevelLabel(riskLevel: "low" | "medium" | "high" | "critical"): string {
  switch (riskLevel) {
    case "low":     return "Low Risk"
    case "medium":  return "Medium Risk"
    case "high":    return "High Risk"
    case "critical":return "Critical Risk"
  }
}
