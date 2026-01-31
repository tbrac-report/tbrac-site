"use client"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { Mail, Clock, Globe } from "lucide-react"

export default function ContactPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-accent py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary-foreground mb-4">
            {t("contactPageTitle")}
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            {t("contactPageSubtitle")}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-border">
              <CardContent className="p-8 space-y-8">
                {/* Email Contact */}
                <div className="text-center space-y-4">
                  <p className="text-lg text-muted-foreground">{t("contactInstructions")}</p>
                  
                  <a
                    href="mailto:evaluations@tbrac.org"
                    className="inline-flex items-center gap-3 text-2xl font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    <Mail className="h-8 w-8" />
                    evaluations@tbrac.org
                  </a>
                </div>

                <div className="border-t border-border pt-8 space-y-6">
                  {/* Response Time */}
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Response Time</h3>
                      <p className="text-muted-foreground">{t("contactResponseTime")}</p>
                    </div>
                  </div>

                  {/* Office Location */}
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{t("contactOffice")}</h3>
                      <p className="text-muted-foreground">{t("contactOfficeText")}</p>
                    </div>
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
