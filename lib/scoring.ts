import { ASSESSMENT_CATEGORIES, type Question } from "./assessment-data"
import type { AssessmentResponses } from "./assessment-schema"

export interface CategoryScore {
  categoryId: string
  categoryName: string
  score: number // 0-100
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
  overallScore: number // 0-100
  overallRiskLevel: "low" | "medium" | "high" | "critical"
  categoryScores: CategoryScore[]
  completionPercentage: number
  recommendations: string[]
  strengths: string[]
  concerns: string[]
}

// Risk level thresholds
const RISK_THRESHOLDS = {
  low: 75, // 75-100
  medium: 50, // 50-74
  high: 25, // 25-49
  critical: 0, // 0-24
}

function getRiskLevel(score: number): "low" | "medium" | "high" | "critical" {
  if (score >= RISK_THRESHOLDS.low) return "low"
  if (score >= RISK_THRESHOLDS.medium) return "medium"
  if (score >= RISK_THRESHOLDS.high) return "high"
  return "critical"
}

function scoreQuestion(question: Question, answer: any): number {
  if (answer === undefined || answer === null) return 0

  const maxPoints = 10 * question.weight

  switch (question.type) {
    case "rating":
      // Direct score (0-10) multiplied by weight
      return (answer / 10) * maxPoints

    case "boolean":
      // Check question context to determine if true/false is good
      // Questions asking about negative things (violations, disputes, etc.)
      const isNegativeQuestion =
        question.text.toLowerCase().includes("violation") ||
        question.text.toLowerCase().includes("dispute") ||
        question.text.toLowerCase().includes("investigation") ||
        question.text.toLowerCase().includes("breach") ||
        question.text.toLowerCase().includes("sanction") ||
        question.text.toLowerCase().includes("controversy") ||
        question.text.toLowerCase().includes("fine")

      if (isNegativeQuestion) {
        // For negative questions, false = good (full points)
        return answer === false ? maxPoints : 0
      } else {
        // For positive questions, true = good (full points)
        return answer === true ? maxPoints : 0
      }

    case "multipleChoice":
      // Score based on answer position (more favorable = higher score)
      if (!question.options) return 0

      const answerIndex = question.options.indexOf(answer)
      if (answerIndex === -1) return 0

      // Analyze options to determine scoring direction
      const firstOption = question.options[0].toLowerCase()
      const lastOption = question.options[question.options.length - 1].toLowerCase()

      // If first option contains negative words, reverse scoring
      const isReversed =
        firstOption.includes("not") ||
        firstOption.includes("never") ||
        firstOption.includes("0-") ||
        firstOption.includes("poor") ||
        firstOption.includes("hostile") ||
        lastOption.includes("100%") ||
        lastOption.includes("excellent") ||
        lastOption.includes("expert")

      const normalizedScore = answerIndex / (question.options.length - 1)
      const finalScore = isReversed ? normalizedScore : 1 - normalizedScore

      return finalScore * maxPoints

    case "text":
      // Text answers get partial credit if provided
      return answer.length > 0 ? maxPoints * 0.5 : 0

    default:
      return 0
  }
}

export function calculateAssessmentScore(responses: AssessmentResponses): AssessmentResult {
  const categoryScores: CategoryScore[] = []
  let totalScore = 0
  let totalMaxScore = 0
  let answeredQuestions = 0
  let totalQuestions = 0

  // Calculate scores for each category
  ASSESSMENT_CATEGORIES.forEach((category) => {
    const subcategoryScores: SubcategoryScore[] = []
    let categoryScore = 0
    let categoryMaxScore = 0

    category.subcategories.forEach((subcategory) => {
      let subcategoryScore = 0
      let subcategoryMaxScore = 0

      subcategory.questions.forEach((question) => {
        totalQuestions++
        const maxPoints = 10 * question.weight
        subcategoryMaxScore += maxPoints
        categoryMaxScore += maxPoints
        totalMaxScore += maxPoints

        const answer = responses[question.id]
        if (answer !== undefined && answer !== null) {
          answeredQuestions++
          const points = scoreQuestion(question, answer)
          subcategoryScore += points
          categoryScore += points
          totalScore += points
        }
      })

      subcategoryScores.push({
        subcategoryId: subcategory.id,
        subcategoryName: subcategory.name,
        score: subcategoryScore,
        maxScore: subcategoryMaxScore,
      })
    })

    const categoryScorePercentage = categoryMaxScore > 0 ? (categoryScore / categoryMaxScore) * 100 : 0

    categoryScores.push({
      categoryId: category.id,
      categoryName: category.name,
      score: categoryScorePercentage,
      maxScore: 100,
      subcategoryScores,
      riskLevel: getRiskLevel(categoryScorePercentage),
    })
  })

  const overallScore = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0
  const completionPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0

  // Generate recommendations, strengths, and concerns
  const { recommendations, strengths, concerns } = generateInsights(categoryScores, overallScore)

  return {
    overallScore,
    overallRiskLevel: getRiskLevel(overallScore),
    categoryScores,
    completionPercentage,
    recommendations,
    strengths,
    concerns,
  }
}

function generateInsights(
  categoryScores: CategoryScore[],
  overallScore: number,
): {
  recommendations: string[]
  strengths: string[]
  concerns: string[]
} {
  const recommendations: string[] = []
  const strengths: string[] = []
  const concerns: string[] = []

  // Analyze each category
  categoryScores.forEach((category) => {
    if (category.score >= 75) {
      strengths.push(`Strong performance in ${category.categoryName} (${Math.round(category.score)}%)`)
    } else if (category.score < 50) {
      concerns.push(`${category.categoryName} shows significant risk (${Math.round(category.score)}%)`)
      recommendations.push(`Prioritize improvements in ${category.categoryName} before market entry`)
    }
  })

  // Overall recommendations based on score
  if (overallScore >= 75) {
    recommendations.push("Your company shows strong readiness for US market entry")
    recommendations.push("Consider engaging with US legal counsel to finalize compliance strategies")
    recommendations.push("Prepare detailed documentation for potential regulatory inquiries")
  } else if (overallScore >= 50) {
    recommendations.push("Moderate risk profile - address key concerns before proceeding")
    recommendations.push("Develop a comprehensive risk mitigation plan for identified weak areas")
    recommendations.push("Consider phased market entry to manage risks effectively")
  } else {
    recommendations.push("Significant risks identified - substantial preparation needed before US market entry")
    recommendations.push("Engage with specialized consultants to address critical risk categories")
    recommendations.push("Consider alternative market entry strategies or partnerships to mitigate risks")
  }

  // Add specific recommendations based on category performance
  const weakestCategory = categoryScores.reduce((min, cat) => (cat.score < min.score ? cat : min))
  if (weakestCategory.score < 60) {
    recommendations.push(`Focus immediate attention on ${weakestCategory.categoryName} - your weakest risk category`)
  }

  return { recommendations, strengths, concerns }
}

export function getRiskLevelColor(riskLevel: "low" | "medium" | "high" | "critical"): string {
  switch (riskLevel) {
    case "low":
      return "text-green-600 dark:text-green-400"
    case "medium":
      return "text-yellow-600 dark:text-yellow-400"
    case "high":
      return "text-orange-600 dark:text-orange-400"
    case "critical":
      return "text-red-600 dark:text-red-400"
  }
}

export function getRiskLevelBgColor(riskLevel: "low" | "medium" | "high" | "critical"): string {
  switch (riskLevel) {
    case "low":
      return "bg-green-100 dark:bg-green-950"
    case "medium":
      return "bg-yellow-100 dark:bg-yellow-950"
    case "high":
      return "bg-orange-100 dark:bg-orange-950"
    case "critical":
      return "bg-red-100 dark:bg-red-950"
  }
}

export function getRiskLevelLabel(riskLevel: "low" | "medium" | "high" | "critical"): string {
  switch (riskLevel) {
    case "low":
      return "Low Risk"
    case "medium":
      return "Medium Risk"
    case "high":
      return "High Risk"
    case "critical":
      return "Critical Risk"
  }
}
