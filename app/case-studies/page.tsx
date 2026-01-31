"use client"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CaseStudiesPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-accent py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary-foreground mb-4">
            {t("caseStudiesPageTitle")}
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            {t("caseStudiesPageSubtitle")}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-border">
              <CardContent className="p-12 text-center space-y-6">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">{t("caseStudiesComingSoon")}</h2>
                  <p className="text-muted-foreground leading-relaxed">{t("caseStudiesDescription")}</p>
                </div>

                <Button asChild variant="outline" className="mt-6 bg-transparent">
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t("backToHome")}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
