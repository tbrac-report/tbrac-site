"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ASSESSMENT_CATEGORIES,
  getCategoryById,
  type Question,
} from "@/lib/assessment-data";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { getAssessmentTranslation } from "@/lib/assessment-translations";
import { useAssessmentContext } from "@/lib/assessment-context";
import {
  useSaveAssessmentAnswers,
  useAssessment,
  useSubmitAssessment,
} from "@/hooks/use-assessments";
import { useApiToast } from "@/hooks/use-api-toast";

interface PageProps {
  params: Promise<{ category: string }>;
}

export default function CategoryAssessmentPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { language, t } = useLanguage();
  const { assessmentId } = useAssessmentContext();
  const { data: assessment } = useAssessment(assessmentId);
  const { saveAnswers } = useSaveAssessmentAnswers();
  const { submit } = useSubmitAssessment();
  const { handleError, showSuccess } = useApiToast();

  const category = getCategoryById(resolvedParams.category);
  const categoryIndex = ASSESSMENT_CATEGORIES.findIndex(
    (c) => c.id === resolvedParams.category,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const schema = z.object(
    category?.subcategories.reduce(
      (acc, subcategory) => {
        subcategory.questions.forEach((question) => {
          if (question.type === "rating") {
            acc[question.id] = z.number().min(0).max(10);
          } else if (question.type === "boolean") {
            acc[question.id] = z.boolean();
          } else if (question.type === "text") {
            acc[question.id] = z.string().min(1, "This field is required");
          } else {
            acc[question.id] = z.string().min(1, "Please select an option");
          }
        });
        return acc;
      },
      {} as Record<string, any>,
    ) || {},
  );

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    if (mounted && assessment?.responses) {
      form.reset(assessment.responses);
    }
  }, [mounted, assessment, form]);

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold mb-4">
                {t("categoryNotFound")}
              </h2>
              <Button onClick={() => router.push("/assessment/start")}>
                {t("returnToStart")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  async function onSubmit(data: any) {
    if (!assessmentId) {
      handleError(
        new Error("No assessment ID found. Please start the assessment again."),
      );
      router.push("/assessment/start");
      return;
    }

    setIsSaving(true);

    try {
      const progressPercentage = Math.round(
        ((categoryIndex + 1) / ASSESSMENT_CATEGORIES.length) * 100,
      );

      await saveAnswers(assessmentId, {
        responses: data,
        category: category.id,
        progress_percentage: progressPercentage,
      });

      if (categoryIndex < ASSESSMENT_CATEGORIES.length - 1) {
        const nextCategory = ASSESSMENT_CATEGORIES[categoryIndex + 1];
        router.push(`/assessment/${nextCategory.id}`);
      } else {
        // Assessment complete - submit and go to profile
        if (assessmentId) {
          await submit(assessmentId);
          showSuccess(
            "Assessment submitted successfully! You can now upload supporting documents.",
          );
        }
        router.push("/company/profile");
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsSaving(false);
    }
  }

  function handlePrevious() {
    if (categoryIndex > 0) {
      const prevCategory = ASSESSMENT_CATEGORIES[categoryIndex - 1];
      router.push(`/assessment/${prevCategory.id}`);
    } else {
      router.push("/assessment/start");
    }
  }

  const progress = ((categoryIndex + 1) / ASSESSMENT_CATEGORIES.length) * 100;

  const translatedCategoryName = getAssessmentTranslation(
    language,
    "categories",
    category.id,
    "name",
  );
  const translatedCategoryDesc = getAssessmentTranslation(
    language,
    "categories",
    category.id,
    "description",
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto mb-8 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {t("category")} {categoryIndex + 1} {t("of")}{" "}
              {ASSESSMENT_CATEGORIES.length}
            </span>
            <span>
              {Math.round(progress)}% {t("complete")}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {translatedCategoryName}
                </h1>
                <p className="text-muted-foreground">
                  {translatedCategoryDesc}
                </p>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Accordion
                type="multiple"
                defaultValue={category.subcategories.map((s) => s.id)}
                className="space-y-4"
              >
                {category.subcategories.map((subcategory) => {
                  const translatedSubcatName = getAssessmentTranslation(
                    language,
                    "categories",
                    category.id,
                    `subcategories.${subcategory.id}.name`,
                  );
                  const translatedSubcatDesc = getAssessmentTranslation(
                    language,
                    "categories",
                    category.id,
                    `subcategories.${subcategory.id}.description`,
                  );

                  return (
                    <AccordionItem
                      key={subcategory.id}
                      value={subcategory.id}
                      className="border-border"
                    >
                      <Card>
                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                          <div className="text-left">
                            <h3 className="text-lg font-semibold text-foreground">
                              {translatedSubcatName}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {translatedSubcatDesc}
                            </p>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <CardContent className="space-y-6 pt-4">
                            {subcategory.questions.map((question) => (
                              <QuestionRenderer
                                key={question.id}
                                question={question}
                                form={form}
                                language={language}
                              />
                            ))}
                          </CardContent>
                        </AccordionContent>
                      </Card>
                    </AccordionItem>
                  );
                })}
              </Accordion>

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex-1 bg-transparent"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("previous")}
                </Button>
                <Button type="submit" className="flex-1" disabled={isSaving}>
                  {isSaving
                    ? "Submitting..."
                    : categoryIndex < ASSESSMENT_CATEGORIES.length - 1
                      ? t("nextCategory")
                      : "Submit Assessment"}
                  {categoryIndex < ASSESSMENT_CATEGORIES.length - 1 ? (
                    <ArrowRight className="ml-2 h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

function QuestionRenderer({
  question,
  form,
  language,
}: {
  question: Question;
  form: any;
  language: "en" | "zh";
}) {
  const translatedQuestion = getAssessmentTranslation(
    language,
    "questions",
    question.id,
  );
  const { t } = useLanguage();

  if (question.type === "rating") {
    return (
      <FormField
        control={form.control}
        name={question.id}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{translatedQuestion}</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <Input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  value={field.value || 0}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0</span>
                  <span className="font-semibold text-foreground">
                    {field.value || 0}
                  </span>
                  <span>10</span>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (question.type === "boolean") {
    return (
      <FormField
        control={form.control}
        name={question.id}
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>{translatedQuestion}</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => field.onChange(value === "true")}
                value={
                  field.value === undefined
                    ? undefined
                    : field.value
                      ? "true"
                      : "false"
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id={`${question.id}-yes`} />
                  <label
                    htmlFor={`${question.id}-yes`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {t("yes")}
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id={`${question.id}-no`} />
                  <label
                    htmlFor={`${question.id}-no`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {t("no")}
                  </label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (question.type === "multipleChoice" && question.options) {
    return (
      <FormField
        control={form.control}
        name={question.id}
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>{translatedQuestion}</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="space-y-2"
              >
                {question.options.map((option, index) => {
                  const translatedOption = getAssessmentTranslation(
                    language,
                    "options",
                    option,
                  );

                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={option}
                        id={`${question.id}-${index}`}
                      />
                      <label
                        htmlFor={`${question.id}-${index}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {translatedOption}
                      </label>
                    </div>
                  );
                })}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (question.type === "text") {
    return (
      <FormField
        control={form.control}
        name={question.id}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{translatedQuestion}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t("enterAnswer")}
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return null;
}
