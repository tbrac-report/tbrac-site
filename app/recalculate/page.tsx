"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { useLanguage } from "@/lib/language-context"
import { RefreshCw, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RecalculatePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto">
          <Card className="border-border">
            <CardContent className="p-8 sm:p-12">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <RefreshCw className="h-8 w-8 text-primary" />
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  {t("recalculateComingSoonTitle")}
                </h1>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t("recalculateComingSoonBody")}
                </p>

                <Button asChild className="mt-4">
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t("backToHome")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
