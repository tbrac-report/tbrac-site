"use client"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { Target, Shield, Cpu, Users } from "lucide-react"

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-accent py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary-foreground mb-4">
            {t("aboutPageTitle")}
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            {t("aboutPageSubtitle")}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Mission */}
            <Card className="border-border">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">{t("aboutMission")}</h2>
                    <p className="text-muted-foreground leading-relaxed">{t("aboutMissionText")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why TBRAC Exists */}
            <Card className="border-border">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">{t("aboutWhy")}</h2>
                    <p className="text-muted-foreground leading-relaxed">{t("aboutWhyText")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Our Approach */}
            <Card className="border-border">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Cpu className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">{t("aboutApproach")}</h2>
                    <p className="text-muted-foreground leading-relaxed">{t("aboutApproachText")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Built by Experts */}
            <Card className="border-border">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">{t("aboutTeam")}</h2>
                    <p className="text-muted-foreground leading-relaxed">{t("aboutTeamText")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
