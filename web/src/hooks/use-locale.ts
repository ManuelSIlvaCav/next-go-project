'use client'

import { getCookie, setCookie } from 'cookies-next'
import { useEffect, useState } from 'react'

/**
 * Custom hook to get and listen to locale changes from cookies
 * @returns Current locale value (defaults to 'es')
 */
export function useLocale() {
  const [locale, setLocale] = useState<string>('es')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get initial value from cookies
    const storedLocale = getCookie('locale') as string
    if (storedLocale) {
      setLocale(storedLocale)
    }

    // Listen for locale changes
    const handleLocaleChange = (event: CustomEvent<{ locale: string }>) => {
      setLocale(event.detail.locale)
    }

    window.addEventListener('localeChange', handleLocaleChange as EventListener)

    return () => {
      window.removeEventListener('localeChange', handleLocaleChange as EventListener)
    }
  }, [])

  return { locale, mounted }
}

/**
 * Get the current locale from cookies (synchronous, for server components)
 * Note: This will return 'es' by default on server-side
 * @returns Current locale value
 */
export function getLocale(): string {
  if (typeof window === 'undefined') return 'es'
  return (getCookie('locale') as string) || 'es'
}

/**
 * Set the locale in cookies and dispatch event
 * @param locale - The locale code to set ('en' or 'es')
 */
export function setLocaleValue(locale: string): void {
  if (typeof window === 'undefined') return
  setCookie('locale', locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  })
  window.dispatchEvent(new CustomEvent('localeChange', { detail: { locale } }))
}
