"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Clock, CheckCircle2, AlertCircle, Search, LogOut, TrendingUp } from "lucide-react"
import type { Submission } from "@/lib/evaluator-types"

export default function EvaluatorDashboardPage() {
  const router = useRouter()
  const [evaluatorName, setEvaluatorName] = useState("")
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("pending")

  useEffect(() => {
    // Check if evaluator is logged in
    const session = localStorage.getItem("evaluator_session")
    if (!session) {
      router.push("/evaluator-login")
      return
    }

    const evaluator = JSON.parse(session)
    setEvaluatorName(evaluator.name)

    // Load submissions (in production, this would come from a backend)
    loadSubmissions()
  }, [router])

  const loadSubmissions = () => {
    // Load real submission from localStorage if exists
    const realSubmission = localStorage.getItem("tbrac_submission")
    const mockSubmissions: Submission[] = []

    if (realSubmission) {
      const submission = JSON.parse(realSubmission)
      mockSubmissions.push({
        id: "SUB-001",
        ...submission,
        lastUpdated: submission.submittedAt,
      })
    }

    // Add mock submissions for demo
    const mockData: Submission[] = [
      {
        id: "SUB-002",
        companyInfo: {
          companyName: "ByteDance Ltd.",
          countryOfOrigin: "China",
          industry: "Technology/Software",
          companySize: "1000+",
          contactEmail: "contact@bytedance.com",
          contactName: "Zhang Wei",
        },
        responses: {},
        result: {
          overallScore: 67,
          overallRiskLevel: "medium",
          categoryScores: [],
          completionPercentage: 100,
          recommendations: [],
          strengths: [],
          concerns: [],
        },
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "under_review",
        assignedEvaluator: evaluatorName,
        lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "SUB-003",
        companyInfo: {
          companyName: "Huawei Technologies",
          countryOfOrigin: "China",
          industry: "Telecommunications",
          companySize: "1000+",
          contactEmail: "global@huawei.com",
          contactName: "Li Ming",
        },
        responses: {},
        result: {
          overallScore: 45,
          overallRiskLevel: "high",
          categoryScores: [],
          completionPercentage: 100,
          recommendations: [],
          strengths: [],
          concerns: [],
        },
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "approved",
        assignedEvaluator: "John Smith",
        certificateIssued: true,
        finalScore: 48,
        lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "SUB-004",
        companyInfo: {
          companyName: "Alibaba Cloud",
          countryOfOrigin: "China",
          industry: "Technology/Software",
          companySize: "1000+",
          contactEmail: "cloud@alibaba.com",
          contactName: "Wang Lei",
        },
        responses: {},
        result: {
          overallScore: 82,
          overallRiskLevel: "low",
          categoryScores: [],
          completionPercentage: 100,
          recommendations: [],
          strengths: [],
          concerns: [],
        },
        submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "approved",
        assignedEvaluator: "Sarah Johnson",
        certificateIssued: true,
        finalScore: 85,
        lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    setSubmissions([...mockSubmissions, ...mockData])
  }

  const handleLogout = () => {
    localStorage.removeItem("evaluator_session")
    router.push("/evaluator-login")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_review":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending Review
          </Badge>
        )
      case "under_review":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Under Review
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Approved
          </Badge>
        )
      case "changes_requested":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Changes Requested
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.companyInfo.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "pending") return matchesSearch && sub.status === "pending_review"
    if (activeTab === "reviewing") return matchesSearch && sub.status === "under_review"
    if (activeTab === "completed") return matchesSearch && (sub.status === "approved" || sub.status === "completed")
    return matchesSearch
  })

  const stats = {
    pending: submissions.filter((s) => s.status === "pending_review").length,
    underReview: submissions.filter((s) => s.status === "under_review").length,
    approved: submissions.filter((s) => s.status === "approved" || s.status === "completed").length,
    total: submissions.length,
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Evaluator Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back, {evaluatorName}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{stats.pending}</p>
                  </div>
                  <Clock className="h-10 w-10 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Under Review</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{stats.underReview}</p>
                  </div>
                  <AlertCircle className="h-10 w-10 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Approved</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{stats.approved}</p>
                  </div>
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Submissions</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{stats.total}</p>
                  </div>
                  <FileText className="h-10 w-10 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submissions Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Assessment Submissions</CardTitle>
                  <CardDescription>Review and manage TBRAC assessment submissions</CardDescription>
                </div>
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search submissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-[300px]"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All ({submissions.length})</TabsTrigger>
                  <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                  <TabsTrigger value="reviewing">Reviewing ({stats.underReview})</TabsTrigger>
                  <TabsTrigger value="completed">Completed ({stats.approved})</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Country</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Evaluator</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSubmissions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                              No submissions found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredSubmissions.map((submission) => (
                            <TableRow key={submission.id}>
                              <TableCell className="font-mono text-sm">{submission.id}</TableCell>
                              <TableCell className="font-medium">{submission.companyInfo.companyName}</TableCell>
                              <TableCell>{submission.companyInfo.countryOfOrigin}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">{Math.round(submission.result.overallScore)}</span>
                                  <TrendingUp
                                    className={`h-4 w-4 ${submission.result.overallScore >= 75 ? "text-green-500" : submission.result.overallScore >= 50 ? "text-yellow-500" : "text-red-500"}`}
                                  />
                                </div>
                              </TableCell>
                              <TableCell>{getStatusBadge(submission.status)}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {new Date(submission.submittedAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-sm">{submission.assignedEvaluator || "-"}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => router.push(`/evaluator/review/${submission.id}`)}
                                >
                                  Review
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
