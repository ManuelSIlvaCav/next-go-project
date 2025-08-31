'use client'

import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { Switch } from '@/components/ui/switch'

export function ColorModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light')
  }

  return (
    <div className="flex items-center space-x-2">
      <SunIcon className="h-4 w-4 text-yellow-500" />
      <Switch checked={isDark} onCheckedChange={handleToggle} aria-label="Toggle dark mode" />
      <MoonIcon className="h-4 w-4 text-blue-400" />
    </div>
  )
}
