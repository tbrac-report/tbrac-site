"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Language } from "./translations"
import { translations } from "./translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Helper function to get cookie value
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
  return match ? match[2] : null
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  // Load language preference on mount
  // Priority: 1. User's explicit choice (localStorage) 2. Geo-detected language (cookie) 3. Default (English)
  useEffect(() => {
    // First check if user has explicitly chosen a language
    const savedLanguage = localStorage.getItem("tbrac-language") as Language | null
    if (savedLanguage === "en" || savedLanguage === "zh") {
      setLanguageState(savedLanguage)
      return
    }

    // If no explicit choice, check geo-detected language from cookie
    const geoLanguage = getCookie("tbrac-geo-language") as Language | null
    if (geoLanguage === "en" || geoLanguage === "zh") {
      setLanguageState(geoLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    // Save to localStorage as the user's explicit preference
    localStorage.setItem("tbrac-language", lang)
    // Also set a cookie so middleware knows user has made a choice
    document.cookie = `tbrac-language-pref=${lang}; path=/; max-age=${60 * 60 * 24 * 365}`
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
