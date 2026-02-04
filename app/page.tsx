"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import {
  CheckCircle2,
  Shield,
  Users,
  FileText,
  TrendingUp,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-accent py-20 sm:py-32 pb-12">
        <div className="absolute inset-0 bg-[url('/abstract-professional-pattern.png')] opacity-5" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full bg-background/10 backdrop-blur-sm px-4 py-2 text-sm text-primary-foreground">
                <Shield className="mr-2 h-4 w-4" />
                {t("trustedBy")}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary-foreground text-balance leading-tight">
                {t("heroTitle")}
              </h1>

              <p className="text-lg sm:text-xl text-primary-foreground/90 leading-relaxed max-w-2xl">
                {t("heroDescription")}
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    asChild
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8 py-6"
                  >
                    <Link href="/assessment/start">{t("startAssessment")}</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="bg-background/10 backdrop-blur-sm text-primary-foreground border-primary-foreground/20 hover:bg-background/20 text-lg px-8 py-6"
                  >
                    <Link href="/company/login">Sign In</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="bg-background/10 backdrop-blur-sm text-primary-foreground border-primary-foreground/20 hover:bg-background/20 text-lg px-8 py-6"
                  >
                    <Link href="/about">{t("learnMore")}</Link>
                  </Button>
                </div>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="bg-transparent backdrop-blur-sm text-primary-foreground border-primary-foreground/30 hover:bg-background/10 text-base px-6 py-4 w-fit"
                >
                  <Link href="/recalculate">
                    {t("recalculateExistingReport")}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Score Preview Card */}
            <div className="relative">
              <Card className="bg-background shadow-2xl border-0">
                <CardContent className="p-8 sm:p-12">
                  <div className="space-y-6">
                    <div className="text-center space-y-4">
                      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {t("tbracCompositeScore")}
                      </div>
                      <div className="text-7xl sm:text-8xl font-bold text-foreground">
                        96
                      </div>
                      <div className="space-y-2">
                        <div className="text-lg font-semibold text-secondary">
                          {t("congratsBoost")}
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                          {t("excellent")}
                        </div>
                      </div>
                    </div>

                    <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-destructive via-secondary to-accent rounded-full"
                        style={{ width: "96%" }}
                      />
                    </div>

                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>0</span>
                      <span className="text-xs underline">
                        {t("sampleScore")}
                      </span>
                      <span>100</span>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <div className="flex-1 text-center py-2 px-3 text-xs font-medium text-muted-foreground border border-border rounded-md bg-muted/50">
                        {t("downloadYourEvaluation")}
                      </div>
                      <div className="flex-1 text-center py-2 px-3 text-xs font-medium text-muted-foreground border border-border rounded-md bg-muted/20">
                        {t("shareYourEvaluation")}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Disclaimer text - positioned at bottom right */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8">
          <p className="text-xs text-primary-foreground/50 whitespace-nowrap">
            {t("usMarketDisclaimer")}
          </p>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">
                  {t("trustIndicator1")}
                </h3>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">
                  {t("trustIndicator2")}
                </h3>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">
                  {t("trustIndicator3")}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance">
              {t("frameworkTitle")}
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("frameworkDescription")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Shield,
                title: t("regulatoryScrutiny"),
                description: t("regulatoryDesc"),
              },
              {
                icon: TrendingUp,
                title: t("politicalRisk"),
                description: t("politicalDesc"),
              },
              {
                icon: Lock,
                title: t("dataSecurityRisk"),
                description: t("dataSecurityDesc"),
              },
              {
                icon: FileText,
                title: t("ipProtection"),
                description: t("ipDesc"),
              },
              {
                icon: Users,
                title: t("reputationalRisk"),
                description: t("reputationalDesc"),
              },
              {
                icon: Shield,
                title: t("nationalSecurity"),
                description: t("nationalSecurityDesc"),
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-border hover:border-accent transition-colors"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-primary-foreground text-balance">
              {t("ctaTitle")}
            </h2>
            <p className="text-lg sm:text-xl text-primary-foreground/90 leading-relaxed">
              {t("ctaDescription")}
            </p>
            <Button
              size="lg"
              asChild
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8 py-6"
            >
              <Link href="/assessment/start">{t("beginAssessment")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">
                {t("tbracReports")}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("footerDescription")}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">
                {t("resources")}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/methodology"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t("methodology")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/case-studies"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t("caseStudies")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t("faq")}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">{t("company")}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t("aboutUs")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t("contact")}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">{t("legal")}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t("privacyPolicy")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t("termsOfService")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} {t("allRightsReserved")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
