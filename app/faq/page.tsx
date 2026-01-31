"use client"

import { Header } from "@/components/header"
import { useLanguage } from "@/lib/language-context"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function FAQPage() {
  const { t } = useLanguage()

  const faqs = [
    { question: t("faqQuestion1"), answer: t("faqAnswer1") },
    { question: t("faqQuestion2"), answer: t("faqAnswer2") },
    { question: t("faqQuestion3"), answer: t("faqAnswer3") },
    { question: t("faqQuestion4"), answer: t("faqAnswer4") },
    { question: t("faqQuestion5"), answer: t("faqAnswer5") },
    { question: t("faqQuestion6"), answer: t("faqAnswer6") },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-accent py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary-foreground mb-4">
            {t("faqPageTitle")}
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            {t("faqPageSubtitle")}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-8">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Contact CTA */}
            <Card className="border-border bg-muted/30">
              <CardContent className="p-8 text-center space-y-4">
                <h3 className="text-xl font-semibold text-foreground">{t("faqMoreQuestions")}</h3>
                <p className="text-muted-foreground">
                  {t("faqContactUs")}{" "}
                  <a
                    href="mailto:evaluations@tbrac.org"
                    className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1"
                  >
                    <Mail className="h-4 w-4" />
                    evaluations@tbrac.org
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
