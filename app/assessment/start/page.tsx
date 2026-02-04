"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/header";
import { companyInfoSchema, type CompanyInfo } from "@/lib/assessment-schema";
import { ArrowRight, Building2, Globe2, Mail, User } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useCreateAssessment } from "@/hooks/use-assessments";
import { useAssessmentContext } from "@/lib/assessment-context";
import { useApiToast } from "@/hooks/use-api-toast";
import type { CompanyInfo as APICompanyInfo } from "@/lib/api-types";

export default function AssessmentStartPage() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { create } = useCreateAssessment();
  const { setAssessmentId, setCurrentAssessment } = useAssessmentContext();
  const { handleError, showSuccess } = useApiToast();

  const form = useForm<CompanyInfo>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      companyName: "",
      countryOfOrigin: "",
      industry: "",
      companySize: "",
      contactEmail: "",
      contactName: "",
    },
  });

  async function onSubmit(data: CompanyInfo) {
    setIsSubmitting(true);

    try {
      // Map form data to API format
      const companyInfo: APICompanyInfo = {
        company_name: data.companyName,
        country: data.countryOfOrigin,
        industry: data.industry,
        company_size: data.companySize,
        contact_name: data.contactName,
        contact_email: data.contactEmail,
      };

      // Create assessment via API
      // TODO: In production, get real customer_id from auth context or customer selection
      const assessment = await create({
        customer_id: "00000000-0000-0000-0000-000000000000", // Placeholder for testing
        company_info: companyInfo,
      });

      if (assessment) {
        setAssessmentId(assessment.id);
        setCurrentAssessment(assessment);
        showSuccess("Assessment started successfully");
        router.push("/assessment/regulatory-scrutiny");
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground text-balance">
              {t("startYourAssessment")}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("assessmentWelcome")}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">10</div>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("riskCategories")}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">~60</div>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("assessmentQuestions")}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">30-45</div>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("minutesToComplete")}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t("companyInformation")}
              </CardTitle>
              <CardDescription>{t("companyInfoDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("companyName")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Acme Corporation"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="countryOfOrigin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("countryOfOrigin")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Globe2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="China"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("primaryIndustry")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("selectIndustry")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="technology">
                              {t("technologySoftware")}
                            </SelectItem>
                            <SelectItem value="telecommunications">
                              {t("telecommunications")}
                            </SelectItem>
                            <SelectItem value="financial">
                              {t("financialServices")}
                            </SelectItem>
                            <SelectItem value="healthcare">
                              {t("healthcare")}
                            </SelectItem>
                            <SelectItem value="energy">
                              {t("energy")}
                            </SelectItem>
                            <SelectItem value="manufacturing">
                              {t("manufacturing")}
                            </SelectItem>
                            <SelectItem value="retail">
                              {t("retailEcommerce")}
                            </SelectItem>
                            <SelectItem value="other">{t("other")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companySize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("companySize")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("selectCompanySize")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-50">
                              {t("employees1to50")}
                            </SelectItem>
                            <SelectItem value="51-200">
                              {t("employees51to200")}
                            </SelectItem>
                            <SelectItem value="201-500">
                              {t("employees201to500")}
                            </SelectItem>
                            <SelectItem value="501-1000">
                              {t("employees501to1000")}
                            </SelectItem>
                            <SelectItem value="1000+">
                              {t("employees1000plus")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("contactName")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="John Doe"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>{t("primaryContact")}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("contactEmail")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          {t("emailDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/")}
                      className="flex-1"
                    >
                      {t("cancel")}
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? t("starting") : t("beginAssessment")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 border-border">
            <CardHeader>
              <CardTitle>{t("whatToExpect")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    {t("expectStep1Title")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t("expectStep1Desc")}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    {t("expectStep2Title")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t("expectStep2Desc")}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    {t("expectStep3Title")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t("expectStep3Desc")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
