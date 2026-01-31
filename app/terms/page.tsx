"use client"

import { Header } from "@/components/header"
import { useLanguage } from "@/lib/language-context"

export default function TermsPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-accent py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary-foreground mb-4">
            {t("termsPageTitle")}
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            {t("termsPageSubtitle")}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
            <p className="text-sm text-muted-foreground mb-8">
              {t("termsLastUpdated")}: January 2026
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8">{t("termsIntro")}</p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">{t("termsUse")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("termsUseText")}</p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">{t("termsAccuracy")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("termsAccuracyText")}</p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">{t("termsIP")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("termsIPText")}</p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">{t("termsLimitation")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("termsLimitationText")}</p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">{t("termsContact")}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t("termsContactText")}{" "}
              <a
                href="mailto:evaluations@tbrac.org"
                className="text-primary hover:text-primary/80 font-medium"
              >
                evaluations@tbrac.org
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
