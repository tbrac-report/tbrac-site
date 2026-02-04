"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useAssessmentContext } from "@/lib/assessment-context";
import { useAssessment } from "@/hooks/use-assessments";
import { useCustomerDocuments } from "@/hooks/use-documents";
import { useApiToast } from "@/hooks/use-api-toast";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Upload,
  Download,
  LogOut,
  CheckCircle2,
  Clock,
  FileCheck,
} from "lucide-react";
import { api } from "@/lib/api-client";

export default function CompanyProfilePage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { assessmentId, currentAssessment } = useAssessmentContext();
  const { data: assessment, isLoading: assessmentLoading } =
    useAssessment(assessmentId);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const {
    data: documentsData,
    refetch: refetchDocuments,
    isLoading: documentsLoading,
  } = useCustomerDocuments(customerId || "", { page: 1, page_size: 50 });
  const { handleError, showSuccess } = useApiToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentTag, setDocumentTag] = useState("");

  // Get customer ID from assessment
  useEffect(() => {
    console.log("Assessment data:", assessment);
    console.log("Current assessment:", currentAssessment);
    if (assessment?.customer_id) {
      console.log(
        "Setting customer ID from assessment:",
        assessment.customer_id,
      );
      setCustomerId(assessment.customer_id);
    } else if (currentAssessment?.customer_id) {
      console.log(
        "Setting customer ID from currentAssessment:",
        currentAssessment.customer_id,
      );
      setCustomerId(currentAssessment.customer_id);
    }
  }, [assessment, currentAssessment]);

  // Debug: Log documents data
  useEffect(() => {
    console.log("Customer ID:", customerId);
    console.log("Documents data:", documentsData);
    console.log("Documents loading:", documentsLoading);
  }, [customerId, documentsData, documentsLoading]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/company/login");
    }
  }, [user, router]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (50MB max)
      const maxSizeInBytes = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSizeInBytes) {
        handleError(
          new Error(
            `File size exceeds 50MB limit. Selected file is ${(file.size / 1024 / 1024).toFixed(2)}MB`,
          ),
        );
        event.target.value = ""; // Clear the input
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !customerId) return;

    setIsUploading(true);
    try {
      // Upload the file (API expects an array)
      await api.documents.upload(customerId, [selectedFile]);

      // Note: The backend will automatically classify documents using AI
      // Custom tags/classification can be added later via the document management page
      // For now, we just upload the file successfully

      showSuccess("Document uploaded successfully");
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setDocumentTag("");
      refetchDocuments();
    } catch (err) {
      handleError(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (documentId: string, filename: string) => {
    try {
      const blob = await api.documents.download(documentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      handleError(err);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (!user) {
    return null;
  }

  const assessmentToDisplay = assessment || currentAssessment;
  const progress = assessmentToDisplay?.progress_percentage || 0;
  const status = assessmentToDisplay?.status || "in_progress";
  const companyInfo = assessmentToDisplay?.company_info;

  console.log("=== PROFILE PAGE RENDER ===");
  console.log("Assessment to display:", assessmentToDisplay);
  console.log("Status:", status);
  console.log("Progress:", progress);
  console.log("Responses:", assessmentToDisplay?.responses);
  console.log("Has responses:", !!assessmentToDisplay?.responses);
  console.log(
    "Response keys:",
    assessmentToDisplay?.responses
      ? Object.keys(assessmentToDisplay.responses)
      : [],
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Company Profile
              </h1>
              <p className="text-muted-foreground mt-2">
                {companyInfo?.company_name || user.email}
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          {/* Company Information */}
          {companyInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Company Name</Label>
                  <p className="text-lg font-medium">
                    {companyInfo.company_name}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Country</Label>
                  <p className="text-lg font-medium">{companyInfo.country}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Industry</Label>
                  <p className="text-lg font-medium capitalize">
                    {companyInfo.industry.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Company Size</Label>
                  <p className="text-lg font-medium">
                    {companyInfo.company_size} employees
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Contact Name</Label>
                  <p className="text-lg font-medium">
                    {companyInfo.contact_name}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Contact Email</Label>
                  <p className="text-lg font-medium">
                    {companyInfo.contact_email}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assessment Status */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment Status</CardTitle>
              <CardDescription>
                Track your TBRAC assessment progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {status === "completed" || status === "submitted" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-500" />
                  )}
                  <span className="font-medium">
                    {status === "completed" || status === "submitted"
                      ? "Assessment Completed"
                      : "Assessment In Progress"}
                  </span>
                </div>
                <Badge
                  variant={
                    status === "completed" || status === "submitted"
                      ? "default"
                      : "secondary"
                  }
                >
                  {progress}% Complete
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {status === "in_progress" && (
                <Button
                  onClick={() =>
                    router.push(
                      assessmentToDisplay?.last_category_viewed
                        ? `/assessment/${assessmentToDisplay.last_category_viewed}`
                        : "/assessment/regulatory-scrutiny",
                    )
                  }
                >
                  Continue Assessment
                </Button>
              )}

              {(status === "completed" || status === "submitted") &&
                assessmentToDisplay?.responses && (
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">
                        Your Assessment Responses
                      </h3>
                      <Badge variant="outline">
                        {Object.keys(assessmentToDisplay.responses).length}{" "}
                        Responses
                      </Badge>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/30 p-4 max-h-96 overflow-y-auto">
                      <div className="space-y-3">
                        {Object.entries(assessmentToDisplay.responses).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="pb-3 border-b border-border last:border-0 last:pb-0"
                            >
                              <p className="text-xs font-medium text-muted-foreground mb-1">
                                {key
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                              </p>
                              <p className="text-sm text-foreground">
                                {typeof value === "boolean"
                                  ? value
                                    ? "Yes"
                                    : "No"
                                  : typeof value === "number"
                                    ? `${value}/10`
                                    : value?.toString() || "Not answered"}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Documents Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>
                    Upload and manage your company documents
                  </CardDescription>
                </div>
                <Dialog
                  open={uploadDialogOpen}
                  onOpenChange={setUploadDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Document
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Document</DialogTitle>
                      <DialogDescription>
                        Upload a document and provide a tag to identify it
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="file">Document File</Label>
                        <Input
                          id="file"
                          type="file"
                          onChange={handleFileSelect}
                          accept=".pdf,.docx,.png,.jpg,.jpeg"
                        />
                        <p className="text-xs text-muted-foreground">
                          Accepted formats: PDF, DOCX, PNG, JPG, JPEG (Max 50MB)
                        </p>
                        {selectedFile && (
                          <p className="text-sm text-foreground">
                            Selected: {selectedFile.name} (
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        )}
                      </div>
                      <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-900 dark:text-blue-100">
                          <strong>Auto-Classification:</strong> Your document
                          will be automatically classified using AI after
                          upload. The system will analyze the content and assign
                          the appropriate document type.
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setUploadDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUpload}
                        disabled={!selectedFile || isUploading}
                      >
                        {isUploading ? "Uploading..." : "Upload"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {!documentsData?.items || documentsData.items.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No documents uploaded yet
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Upload your first document to get started
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Filename</TableHead>
                      <TableHead>Type/Tag</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentsData.items.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          {doc.original_filename}
                        </TableCell>
                        <TableCell>
                          {doc.document_type_override ||
                            doc.document_type ||
                            "Unclassified"}
                        </TableCell>
                        <TableCell>
                          {(doc.file_size_bytes / 1024 / 1024).toFixed(2)} MB
                        </TableCell>
                        <TableCell>
                          {new Date(doc.uploaded_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              doc.processing_status === "completed"
                                ? "default"
                                : doc.processing_status === "failed"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {doc.processing_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDownload(doc.id, doc.original_filename)
                            }
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
