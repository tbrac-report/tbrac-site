"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  calculateAssessmentScore,
  getRiskLevelColor,
  getRiskLevelBgColor,
  getRiskLevelLabel,
  type AssessmentResult,
} from "@/lib/scoring"
import {
  generateReportHTML,
  generateCertificateNumber,
  downloadReport,
  exportToJSON,
  downloadJSON,
  exportToCSV,
  downloadCSV,
  type ReportData,
} from "@/lib/report-generator"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import {
  Download,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  FileText,
  ArrowLeft,
  Shield,
  Award,
  AlertTriangle,
  FileDown,
} from "lucide-react"
import type { CompanyInfo } from "@/lib/assessment-schema"
import { useLanguage } from "@/lib/language-context"

export default function AssessmentResultsPage() {
  const router = useRouter()
  const { language, t } = useLanguage()
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Load responses and calculate score
    const savedResponses = localStorage.getItem("tbrac_responses")
    const savedCompanyInfo = localStorage.getItem("tbrac_company_info")

    if (!savedResponses || !savedCompanyInfo) {
      router.push("/assessment/start")
      return
    }

    try {
      const responses = JSON.parse(savedResponses)
      const company = JSON.parse(savedCompanyInfo)
      setCompanyInfo(company)

      const calculatedResult = calculateAssessmentScore(responses)
      setResult(calculatedResult)

      // Save result to localStorage for evaluator review
      const submission = {
        companyInfo: company,
        responses,
        result: calculatedResult,
        submittedAt: new Date().toISOString(),
        status: "pending_review",
      }
      localStorage.setItem("tbrac_submission", JSON.stringify(submission))
    } catch (error) {
      console.error("[v0] Error calculating results:", error)
      router.push("/assessment/start")
    }
  }, [router])

  const handleDownloadReport = () => {
    if (!result || !companyInfo) return

    setIsExporting(true)

    try {
      const submission = JSON.parse(localStorage.getItem("tbrac_submission") || "{}")
      const reportData: ReportData = {
        submission,
        generatedDate: new Date().toISOString(),
        certificateNumber: generateCertificateNumber(submission.id || "SUB-001"),
      }

      const html = generateReportHTML(reportData)
      const filename = `TBRAC_Report_${companyInfo.companyName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.html`

      downloadReport(html, filename)
    } catch (error) {
      console.error("[v0] Error generating report:", error)
      alert("Failed to generate report. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownloadJSON = () => {
    if (!result || !companyInfo) return

    setIsExporting(true)

    try {
      const submission = JSON.parse(localStorage.getItem("tbrac_submission") || "{}")
      const json = exportToJSON(submission)
      const filename = `TBRAC_Data_${companyInfo.companyName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.json`

      downloadJSON(json, filename)
    } catch (error) {
      console.error("[v0] Error exporting JSON:", error)
      alert("Failed to export data. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownloadCSV = () => {
    if (!result || !companyInfo) return

    setIsExporting(true)

    try {
      const submission = JSON.parse(localStorage.getItem("tbrac_submission") || "{}")
      const csv = exportToCSV(submission)
      const filename = `TBRAC_Responses_${companyInfo.companyName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`

      downloadCSV(csv, filename)
    } catch (error) {
      console.error("[v0] Error exporting CSV:", error)
      alert("Failed to export CSV. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  if (!mounted || !result || !companyInfo) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">{t("calculatingResults")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const categoryChartData = result.categoryScores.map((cat) => ({
    name: cat.categoryName.split(" ")[0], // Shortened name for chart
    fullName: cat.categoryName,
    score: Math.round(cat.score),
    riskLevel: cat.riskLevel,
  }))

  const radarChartData = result.categoryScores.map((cat) => ({
    category: cat.categoryName.length > 20 ? cat.categoryName.substring(0, 17) + "..." : cat.categoryName,
    score: Math.round(cat.score),
  }))

  const getScoreColor = (score: number) => {
    if (score >= 75) return "hsl(var(--chart-1))"
    if (score >= 50) return "hsl(var(--chart-2))"
    if (score >= 25) return "hsl(var(--chart-3))"
    return "hsl(var(--chart-4))"
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">{t("yourAssessmentResults")}</h1>
              <p className="text-lg text-muted-foreground mt-2">{companyInfo.companyName}</p>
            </div>
            <Button onClick={() => router.push("/")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("home")}
            </Button>
          </div>

          {/* Next Steps banner */}
          <Card className="bg-primary text-primary-foreground border-primary">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <h3 className="text-2xl font-bold">{t("preliminaryResultsTitle")}</h3>
                  <p className="text-primary-foreground/90 leading-relaxed">{t("preliminaryResultsBody")}</p>
                  <p className="text-sm text-primary-foreground/80 mt-4">
                    {t("reportWillBeSentTo")} <span className="font-semibold">{companyInfo.contactEmail}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-3 w-full md:w-auto">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        variant="secondary"
                        className="w-full md:w-auto whitespace-nowrap"
                        disabled={isExporting}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {t("downloadReports")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>{t("exportAssessmentData")}</DialogTitle>
                        <DialogDescription>{t("chooseFormat")}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3 py-4">
                        <Button
                          onClick={handleDownloadReport}
                          className="w-full justify-start bg-transparent"
                          variant="outline"
                          disabled={isExporting}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          {t("downloadHTMLReport")}
                          <span className="ml-auto text-xs text-muted-foreground">{t("fullFormattedReport")}</span>
                        </Button>
                        <Button
                          onClick={handleDownloadJSON}
                          className="w-full justify-start bg-transparent"
                          variant="outline"
                          disabled={isExporting}
                        >
                          <FileDown className="mr-2 h-4 w-4" />
                          {t("downloadJSONData")}
                          <span className="ml-auto text-xs text-muted-foreground">{t("rawAssessmentData")}</span>
                        </Button>
                        <Button
                          onClick={handleDownloadCSV}
                          className="w-full justify-start bg-transparent"
                          variant="outline"
                          disabled={isExporting}
                        >
                          <FileDown className="mr-2 h-4 w-4" />
                          {t("downloadCSVExport")}
                          <span className="ml-auto text-xs text-muted-foreground">{t("spreadsheetFormat")}</span>
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overall Score Card */}
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardContent className="p-8">
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t("overallTBRACScore")}</p>
                    <div className="flex items-end gap-3">
                      <div className="text-7xl font-bold text-foreground">{Math.round(result.overallScore)}</div>
                      <div className="text-3xl text-muted-foreground pb-2">/100</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("riskLevel")}</span>
                      <Badge
                        className={`${getRiskLevelBgColor(result.overallRiskLevel)} ${getRiskLevelColor(result.overallRiskLevel)} border-0`}
                      >
                        {getRiskLevelLabel(result.overallRiskLevel)}
                      </Badge>
                    </div>
                    <Progress value={result.overallScore} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Critical</span>
                      <span>Low Risk</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>
                        {Math.round(result.completionPercentage)}% {t("assessmentComplete")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg bg-muted/50 p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      {t("scoreInterpretation")}
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <div className="w-16 font-semibold text-green-600">75-100</div>
                        <div className="text-muted-foreground">{t("lowRiskDescription")}</div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-16 font-semibold text-yellow-600">50-74</div>
                        <div className="text-muted-foreground">{t("mediumRiskDescription")}</div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-16 font-semibold text-orange-600">25-49</div>
                        <div className="text-muted-foreground">{t("highRiskDescription")}</div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-16 font-semibold text-red-600">0-24</div>
                        <div className="text-muted-foreground">{t("criticalRiskDescription")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>{t("categoryScores")}</CardTitle>
                <CardDescription>{t("performanceAcrossCategories")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={categoryChartData} layout="horizontal" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" domain={[0, 100]} className="text-xs" />
                    <YAxis type="category" dataKey="name" className="text-xs" width={80} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="rounded-lg border bg-background p-3 shadow-lg">
                              <p className="font-semibold text-sm mb-1">{data.fullName}</p>
                              <p className="text-2xl font-bold text-foreground">{data.score}</p>
                              <p className="text-xs text-muted-foreground mt-1">{getRiskLevelLabel(data.riskLevel)}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>{t("riskProfile")}</CardTitle>
                <CardDescription>{t("riskProfile360")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarChartData}>
                    <PolarGrid className="stroke-muted" />
                    <PolarAngleAxis
                      dataKey="category"
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.5}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-3 shadow-lg">
                              <p className="font-semibold text-sm">{payload[0].payload.category}</p>
                              <p className="text-2xl font-bold text-primary">{payload[0].value}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Category Results */}
          <Card>
            <CardHeader>
              <CardTitle>{t("detailedCategoryAnalysis")}</CardTitle>
              <CardDescription>{t("inDepthBreakdown")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.categoryScores.map((category) => (
                  <div key={category.categoryId} className="rounded-lg border border-border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-foreground">{category.categoryName}</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          className={`${getRiskLevelBgColor(category.riskLevel)} ${getRiskLevelColor(category.riskLevel)} border-0`}
                        >
                          {getRiskLevelLabel(category.riskLevel)}
                        </Badge>
                        <div className="text-2xl font-bold text-foreground">{Math.round(category.score)}</div>
                      </div>
                    </div>
                    <Progress value={category.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Insights Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Strengths */}
            {result.strengths.length > 0 && (
              <Card className="border-green-200 dark:border-green-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-5 w-5" />
                    {t("strengths")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Concerns */}
            {result.concerns.length > 0 && (
              <Card className="border-orange-200 dark:border-orange-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                    <AlertTriangle className="h-5 w-5" />
                    {t("areasOfConcern")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.concerns.map((concern, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                        {concern}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            <Card className="border-blue-200 dark:border-blue-900 lg:col-span-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <TrendingUp className="h-5 w-5" />
                  {t("recommendations")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.recommendations.map((recommendation, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                {t("questionsAboutResults")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{t("questionsDescription")}</p>
              <Button variant="outline" asChild>
                <a href="/contact">{t("contactOurTeam")}</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
