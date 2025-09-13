import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const { i18n, t } = useTranslation()
  const [language, setLanguageState] = useState(i18n.language)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en'
    setLanguageState(savedLanguage)
    i18n.changeLanguage(savedLanguage)
  }, [i18n])

  const setLanguage = (lang: string) => {
    setLanguageState(lang)
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const value = {
    language,
    setLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
