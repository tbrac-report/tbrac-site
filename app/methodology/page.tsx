"use client"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import {
  Shield,
  TrendingUp,
  Lock,
  FileText,
  Users,
  Building,
  Link as LinkIcon,
  Scale,
  Leaf,
  Briefcase,
} from "lucide-react"

export default function MethodologyPage() {
  const { t } = useLanguage()

  const categories = [
    { icon: Shield, name: t("regulatoryScrutiny"), description: t("regulatoryDesc") },
    { icon: TrendingUp, name: t("politicalGeopoliticalRisk"), description: t("politicalDesc") },
    { icon: Lock, name: t("dataSecurityPrivacy"), description: t("dataSecurityDesc") },
    { icon: FileText, name: t("ipProtection"), description: t("ipDesc") },
    { icon: Users, name: t("reputationalRisk"), description: t("reputationalDesc") },
    { icon: Building, name: t("nationalSecurityConcerns"), description: t("nationalSecurityDesc") },
    { icon: LinkIcon, name: t("supplyChainTransparency"), description: "Assessment of supply chain visibility, vendor relationships, and sourcing practices" },
    { icon: Scale, name: t("marketCompetition"), description: "Evaluation of competitive practices, market behavior, and antitrust considerations" },
    { icon: Briefcase, name: t("laborPractices"), description: "Review of employment practices, labor standards, and workforce policies" },
    { icon: Leaf, name: t("environmentalGovernance"), description: "Assessment of environmental impact, ESG policies, and sustainability practices" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-accent py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary-foreground mb-4">
            {t("methodologyPageTitle")}
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            {t("methodologyPageSubtitle")}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-16">
            {/* Overview */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">{t("methodologyOverview")}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{t("methodologyOverviewText")}</p>
            </div>

            {/* Categories Grid */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-foreground">{t("methodologyCategories")}</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {categories.map((category, index) => (
                  <Card key={index} className="border-border hover:border-accent transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <category.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">
                            {index + 1}. {category.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Scoring */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">{t("methodologyScoring")}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{t("methodologyScoringText")}</p>
              
              <div className="grid gap-4 sm:grid-cols-4 mt-8">
                <Card className="border-accent bg-accent/5">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-accent">80-100</div>
                    <div className="text-sm text-muted-foreground">{t("lowRiskDescription")}</div>
                  </CardContent>
                </Card>
                <Card className="border-secondary bg-secondary/5">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-secondary">60-79</div>
                    <div className="text-sm text-muted-foreground">{t("mediumRiskDescription")}</div>
                  </CardContent>
                </Card>
                <Card className="border-orange-500 bg-orange-500/5">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-500">40-59</div>
                    <div className="text-sm text-muted-foreground">{t("highRiskDescription")}</div>
                  </CardContent>
                </Card>
                <Card className="border-destructive bg-destructive/5">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-destructive">0-39</div>
                    <div className="text-sm text-muted-foreground">{t("criticalRiskDescription")}</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Validation */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">{t("methodologyValidation")}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{t("methodologyValidationText")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
