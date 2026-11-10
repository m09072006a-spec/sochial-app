import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { dict } from './i18n (3).ts'
import type { Key, Lang } from './i18n (3).ts'

type Theme = 'light' | 'dark'

interface SettingsType {
  theme: Theme
  toggleTheme: () => void
  lang: Lang
  toggleLang: () => void
  t: (key: Key) => string
  locale: string
}

const SettingsContext = createContext<SettingsType | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const [lang, setLang] = useState<Lang>(
    () => (localStorage.getItem('lang') as Lang | null) ?? 'en'
  )

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = lang === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem('lang', lang)
  }, [lang])

  const value: SettingsType = {
    theme,
    toggleTheme: () => setTheme((p) => (p === 'dark' ? 'light' : 'dark')),
    lang,
    toggleLang: () => setLang((p) => (p === 'en' ? 'ar' : 'en')),
    t: (key) => dict[lang][key],
    locale: lang === 'ar' ? 'ar-EG' : 'en-US',
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>')
  return ctx
}
