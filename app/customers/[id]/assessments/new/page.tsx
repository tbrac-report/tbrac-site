"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { PortalHeader } from "@/components/portal-header";
import { useCustomer } from "@/hooks/use-customers";
import { useCreateAssessment } from "@/hooks/use-assessments";
import { useApiToast } from "@/hooks/use-api-toast";
import { formatIndustrySector, formatOwnershipType } from "@/lib/format-utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ClipboardList, Building2, MapPin, Tag } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

function NewAssessmentContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: customer, loading: customerLoading } = useCustomer(resolvedParams.id);
  const { create, loading } = useCreateAssessment();
  const { handleError, showSuccess } = useApiToast();

  const handleCreate = async () => {
    if (!customer) return;
    try {
      const assessment = await create({ customer_id: customer.id });
      if (assessment) {
        showSuccess("Assessment created");
        router.push(`/customers/${resolvedParams.id}/assessments/${assessment.id}`);
      }
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PortalHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/customers/${resolvedParams.id}`)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">New Assessment</h1>
              {customer && (
                <p className="text-muted-foreground mt-1">{customer.name}</p>
              )}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Start Risk Assessment
              </CardTitle>
              <CardDescription>
                This will create a new assessment with 10 risk modules. You can
                complete each module independently from the assessment dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {customerLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
              ) : customer ? (
                <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Company
                  </p>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-semibold">{customer.name}</span>
                    {customer.chinese_name && (
                      <span className="text-muted-foreground">
                        ({customer.chinese_name})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {customer.headquarters_country}
                    {customer.headquarters_city && `, ${customer.headquarters_city}`}
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <Badge variant="outline" className="text-xs">
                      {formatIndustrySector(customer.industry_sector)}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {formatOwnershipType(customer.ownership_type)}
                    </Badge>
                  </div>
                </div>
              ) : null}

              <div className="rounded-lg border border-dashed p-4 space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">What to expect</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>10 risk assessment modules created automatically</li>
                  <li>Each module has 10 scored questions (0–10 scale)</li>
                  <li>Upload supporting documents per module</li>
                  <li>Complete modules in any order</li>
                  <li>Final risk tier calculated upon submission</li>
                </ul>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/customers/${resolvedParams.id}`)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={loading || customerLoading || !customer}
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  {loading ? "Creating..." : "Create Assessment"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function NewAssessmentPage({ params }: PageProps) {
  return (
    <ProtectedRoute>
      <NewAssessmentContent params={params} />
    </ProtectedRoute>
  );
}
