"use client"

import Link from "next/link"
import { Globe } from "lucide-react"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/lib/language-context"

export function Header() {
  const { t } = useLanguage()

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <Globe className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-foreground">{t("tbracReports")}</span>
              <span className="text-xs text-muted-foreground italic">{t("propertyOf")}</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t("about")}
            </Link>
            <Link
              href="/methodology"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {t("methodology")}
            </Link>
            <Link href="/contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t("contact")}
            </Link>
            <LanguageToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
