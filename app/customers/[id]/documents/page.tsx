"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { Header } from "@/components/header";
import { DocumentUpload } from "@/components/document-upload";
import { useCustomer } from "@/hooks/use-customers";
import {
  useCustomerDocuments,
  useDocumentDownload,
  useUpdateDocumentClassification,
  useDeleteDocument,
} from "@/hooks/use-documents";
import { useApiToast } from "@/hooks/use-api-toast";
import { DocumentType, type DocumentListItem } from "@/lib/api-types";
import {
  formatDocumentType,
  formatProcessingStatus,
  formatFileSize,
  formatDate,
} from "@/lib/format-utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Download,
  Trash2,
  FileText,
  MoreHorizontal,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

function CustomerDocumentsContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [editingDoc, setEditingDoc] = useState<DocumentListItem | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);

  const { data: customer } = useCustomer(resolvedParams.id);
  const { data, loading, error, refetch } = useCustomerDocuments(
    resolvedParams.id,
    { page, pageSize: 10 },
  );
  const { download } = useDocumentDownload();
  const { updateClassification, loading: classifying } =
    useUpdateDocumentClassification();
  const { deleteDocument, loading: deleting } = useDeleteDocument();
  const { handleError, showSuccess } = useApiToast();

  const handleDownload = async (doc: DocumentListItem) => {
    try {
      await download(doc.id, doc.original_filename);
    } catch (err) {
      handleError(err);
    }
  };

  const handleClassify = async () => {
    if (!editingDoc || !selectedType) return;

    try {
      await updateClassification(editingDoc.id, selectedType);
      showSuccess("Document classification updated");
      setEditingDoc(null);
      setSelectedType("");
      refetch();
    } catch (err) {
      handleError(err);
    }
  };

  const handleDelete = async () => {
    if (!deletingDocId) return;

    try {
      await deleteDocument(deletingDocId);
      showSuccess("Document deleted successfully");
      setDeletingDocId(null);
      refetch();
    } catch (err) {
      handleError(err);
    }
  };

  const getProcessingStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "pending") {
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          {formatProcessingStatus(status as any)}
        </Badge>
      );
    }
    if (statusLower === "processing") {
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          {formatProcessingStatus(status as any)}
        </Badge>
      );
    }
    if (statusLower === "completed") {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          {formatProcessingStatus(status as any)}
        </Badge>
      );
    }
    if (statusLower === "failed") {
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          {formatProcessingStatus(status as any)}
        </Badge>
      );
    }
    if (statusLower === "requires_review") {
      return (
        <Badge
          variant="outline"
          className="bg-orange-50 text-orange-700 border-orange-200"
        >
          {formatProcessingStatus(status as any)}
        </Badge>
      );
    }
    return <Badge variant="outline">{formatProcessingStatus(status as any)}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/customers/${resolvedParams.id}`)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Documents</h1>
              <p className="text-muted-foreground mt-1">
                {customer ? `${customer.name}` : "Customer documents"}
              </p>
            </div>
          </div>

          {/* Upload Section */}
          <DocumentUpload
            customerId={resolvedParams.id}
            onUploadComplete={() => {
              refetch();
            }}
          />

          {/* Documents List */}
          <Card>
            <CardHeader>
              <CardTitle>
                {data ? `${data.total} Document${data.total !== 1 ? "s" : ""}` : "Documents"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="text-center py-8 text-red-600">
                  <p>Failed to load documents: {error}</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => refetch()}
                  >
                    Retry
                  </Button>
                </div>
              )}

              {loading && (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-5 w-[250px]" />
                      <Skeleton className="h-5 w-[100px]" />
                      <Skeleton className="h-5 w-[120px]" />
                      <Skeleton className="h-5 w-[100px]" />
                      <Skeleton className="h-5 w-[80px]" />
                    </div>
                  ))}
                </div>
              )}

              {!loading && !error && data && data.items.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">
                    No documents uploaded
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Upload documents using the form above
                  </p>
                </div>
              )}

              {!loading && !error && data && data.items.length > 0 && (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Filename</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Uploaded
                        </TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.items.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">
                            {doc.original_filename}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatFileSize(doc.file_size_bytes)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {formatDocumentType(doc.document_type)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getProcessingStatusBadge(doc.processing_status)}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-muted-foreground">
                            {formatDate(doc.uploaded_at)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleDownload(doc)}
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditingDoc(doc);
                                    setSelectedType(
                                      doc.document_type || DocumentType.OTHER,
                                    );
                                  }}
                                >
                                  <Tag className="mr-2 h-4 w-4" />
                                  Classify
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setDeletingDocId(doc.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {data.total_pages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Page {data.page} of {data.total_pages}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page <= 1}
                          onClick={() => setPage((p) => p - 1)}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page >= data.total_pages}
                          onClick={() => setPage((p) => p + 1)}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Classification Dialog */}
      <Dialog
        open={editingDoc !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingDoc(null);
            setSelectedType("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Classify Document</DialogTitle>
            <DialogDescription>
              {editingDoc && `Update classification for ${editingDoc.original_filename}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="document-type">Document Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(DocumentType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {formatDocumentType(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingDoc(null);
                setSelectedType("");
              }}
              disabled={classifying}
            >
              Cancel
            </Button>
            <Button onClick={handleClassify} disabled={classifying}>
              {classifying ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={deletingDocId !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingDocId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this document. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function CustomerDocumentsPage({ params }: PageProps) {
  return (
    <ProtectedRoute>
      <CustomerDocumentsContent params={params} />
    </ProtectedRoute>
  );
}
