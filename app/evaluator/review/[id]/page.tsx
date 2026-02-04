"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ASSESSMENT_CATEGORIES, getCategoryById } from "@/lib/assessment-data";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Send,
  FileText,
  Building2,
} from "lucide-react";
import type { Submission, EvaluatorNote } from "@/lib/evaluator-types";

interface PageProps {
  params: Promise<{ id: string }>;
}

function ReviewContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [notes, setNotes] = useState<EvaluatorNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const evaluatorName = user?.email?.split("@")[0] || "Evaluator";

  useEffect(() => {
    // Load submission (in production, fetch from backend)
    loadSubmission();
  }, [resolvedParams.id]);

  const loadSubmission = () => {
    // For demo, load from localStorage
    const saved = localStorage.getItem("tbrac_submission");
    if (saved && resolvedParams.id === "SUB-001") {
      const sub = JSON.parse(saved);
      setSubmission({
        id: "SUB-001",
        ...sub,
        lastUpdated: sub.submittedAt,
        evaluatorNotes: [],
      });
    } else {
      // Mock submission for demo
      alert("Submission not found. Redirecting to dashboard.");
      router.push("/evaluator/dashboard");
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note: EvaluatorNote = {
      id: `NOTE-${Date.now()}`,
      evaluatorName,
      categoryId: selectedCategory || undefined,
      note: newNote,
      createdAt: new Date().toISOString(),
      type: "comment",
    };

    setNotes([...notes, note]);
    setNewNote("");
    setSelectedCategory("");
  };

  const handleApprove = () => {
    if (confirm("Are you sure you want to approve this assessment?")) {
      alert("Assessment approved! Certificate will be generated.");
      router.push("/evaluator/dashboard");
    }
  };

  const handleRequestChanges = () => {
    if (notes.length === 0) {
      alert("Please add notes explaining what changes are needed.");
      return;
    }
    if (confirm("Request changes from the applicant?")) {
      alert("Change request sent to applicant.");
      router.push("/evaluator/dashboard");
    }
  };

  if (!submission) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading submission...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push("/evaluator/dashboard")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
              {submission.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>

          {/* Company Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>{submission.companyInfo.companyName}</CardTitle>
                  <CardDescription>
                    Submission ID: {submission.id} • Submitted on{" "}
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label className="text-muted-foreground">
                    Country of Origin
                  </Label>
                  <p className="font-medium mt-1">
                    {submission.companyInfo.countryOfOrigin}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Industry</Label>
                  <p className="font-medium mt-1">
                    {submission.companyInfo.industry}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Company Size</Label>
                  <p className="font-medium mt-1">
                    {submission.companyInfo.companySize}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Contact Person
                  </Label>
                  <p className="font-medium mt-1">
                    {submission.companyInfo.contactName}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Contact Email</Label>
                  <p className="font-medium mt-1">
                    {submission.companyInfo.contactEmail}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Overall Score</Label>
                  <p className="text-2xl font-bold text-primary mt-1">
                    {Math.round(submission.result.overallScore)}/100
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="responses">
                <TabsList>
                  <TabsTrigger value="responses">
                    Assessment Responses
                  </TabsTrigger>
                  <TabsTrigger value="analysis">Risk Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="responses" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Responses</CardTitle>
                      <CardDescription>
                        Review all assessment answers by category
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion
                        type="single"
                        collapsible
                        className="space-y-2"
                      >
                        {ASSESSMENT_CATEGORIES.map((category) => {
                          const categoryScore =
                            submission.result.categoryScores.find(
                              (cs) => cs.categoryId === category.id,
                            );
                          return (
                            <AccordionItem
                              key={category.id}
                              value={category.id}
                            >
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center justify-between w-full pr-4">
                                  <span className="font-semibold">
                                    {category.name}
                                  </span>
                                  {categoryScore && (
                                    <Badge variant="outline">
                                      {Math.round(categoryScore.score)}/100
                                    </Badge>
                                  )}
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-4 pt-4">
                                  {category.subcategories.map((subcategory) => (
                                    <div
                                      key={subcategory.id}
                                      className="space-y-3"
                                    >
                                      <h4 className="font-medium text-sm text-muted-foreground">
                                        {subcategory.name}
                                      </h4>
                                      {subcategory.questions.map((question) => {
                                        const answer =
                                          submission.responses[question.id];
                                        return (
                                          <div
                                            key={question.id}
                                            className="pl-4 border-l-2 border-muted py-2"
                                          >
                                            <p className="text-sm mb-2">
                                              {question.text}
                                            </p>
                                            <p className="text-sm font-semibold text-primary">
                                              Answer:{" "}
                                              {answer !== undefined
                                                ? String(answer)
                                                : "Not answered"}
                                            </p>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analysis" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Analysis Summary</CardTitle>
                      <CardDescription>
                        AI-generated insights and recommendations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {submission.result.strengths.length > 0 && (
                        <div>
                          <h3 className="font-semibold flex items-center gap-2 mb-3 text-green-700">
                            <CheckCircle2 className="h-5 w-5" />
                            Strengths
                          </h3>
                          <ul className="space-y-2">
                            {submission.result.strengths.map(
                              (strength, idx) => (
                                <li
                                  key={idx}
                                  className="text-sm text-muted-foreground pl-4"
                                >
                                  • {strength}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                      {submission.result.concerns.length > 0 && (
                        <div>
                          <h3 className="font-semibold flex items-center gap-2 mb-3 text-orange-700">
                            <AlertCircle className="h-5 w-5" />
                            Areas of Concern
                          </h3>
                          <ul className="space-y-2">
                            {submission.result.concerns.map((concern, idx) => (
                              <li
                                key={idx}
                                className="text-sm text-muted-foreground pl-4"
                              >
                                • {concern}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-3">
                          <FileText className="h-5 w-5" />
                          Recommendations
                        </h3>
                        <ul className="space-y-2">
                          {submission.result.recommendations.map((rec, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-muted-foreground pl-4"
                            >
                              {idx + 1}. {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Add Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Evaluator Notes</CardTitle>
                  <CardDescription>Add comments and feedback</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Category (optional)</Label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">General Comment</option>
                      {ASSESSMENT_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Note</Label>
                    <Textarea
                      placeholder="Add your evaluation notes..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>

                  <Button
                    onClick={handleAddNote}
                    className="w-full"
                    disabled={!newNote.trim()}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Add Note
                  </Button>

                  {notes.length > 0 && (
                    <div className="mt-6 space-y-3 pt-6 border-t border-border">
                      <h4 className="font-semibold text-sm">
                        Your Notes ({notes.length})
                      </h4>
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className="text-sm p-3 rounded-lg bg-muted"
                        >
                          {note.categoryId && (
                            <Badge variant="outline" className="mb-2 text-xs">
                              {getCategoryById(note.categoryId)?.name}
                            </Badge>
                          )}
                          <p className="text-muted-foreground">{note.note}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Review Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handleApprove}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approve Assessment
                  </Button>
                  <Button
                    onClick={handleRequestChanges}
                    variant="outline"
                    className="w-full bg-transparent"
                  >
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Request Changes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EvaluatorReviewPage({ params }: PageProps) {
  return (
    <ProtectedRoute>
      <ReviewContent params={params} />
    </ProtectedRoute>
  );
}
