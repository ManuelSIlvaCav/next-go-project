'use client'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { getCookie, setCookie } from 'cookies-next'
import { Check, ChevronsUpDown, Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as React from 'react'

const languages = [
  {
    value: 'en',
    label: 'English',
    flag: '🇺🇸',
  },
  {
    value: 'es',
    label: 'Español',
    flag: '🇪🇸',
  },
]

interface LanguageSelectorProps {
  className?: string
}

export default function LanguageSelector({ className }: LanguageSelectorProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [selectedLanguage, setSelectedLanguage] = React.useState('es')
  const [mounted, setMounted] = React.useState(false)

  // Load locale from cookies on mount
  React.useEffect(() => {
    setMounted(true)
    const storedLocale = getCookie('locale') as string
    if (storedLocale && languages.some((lang) => lang.value === storedLocale)) {
      setSelectedLanguage(storedLocale)
    }
  }, [])

  // Save to cookies whenever language changes
  const handleLanguageChange = (languageValue: string) => {
    setSelectedLanguage(languageValue)
    setCookie('locale', languageValue, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    })
    setOpen(false)

    // Trigger router refresh to reload translations
    router.refresh()

    // Optionally trigger a custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('localeChange', { detail: { locale: languageValue } }))
  }

  const currentLanguage = languages.find((lang) => lang.value === selectedLanguage)

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Button
        variant="outline"
        disabled
        className={cn(
          'w-full justify-between h-auto py-2.5 px-3 bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600',
          className,
        )}
      >
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Loading...</span>
        </div>
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between h-auto py-2.5 px-3 bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors',
            className,
          )}
        >
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentLanguage?.flag} {currentLanguage?.label}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[200px] p-0 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
        align="start"
      >
        <Command className="bg-white dark:bg-zinc-800">
          <CommandInput
            placeholder="Search language..."
            className="h-9 text-sm dark:bg-zinc-800 dark:text-white"
          />
          <CommandList>
            <CommandEmpty className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No language found.
            </CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  key={language.value}
                  value={language.value}
                  onSelect={(currentValue) => {
                    handleLanguageChange(
                      currentValue === selectedLanguage ? selectedLanguage : currentValue,
                    )
                  }}
                  className="flex items-center justify-between py-2.5 px-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 aria-selected:bg-gray-100 dark:aria-selected:bg-zinc-700"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{language.flag}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {language.label}
                    </span>
                  </div>
                  <Check
                    className={cn(
                      'h-4 w-4',
                      selectedLanguage === language.value
                        ? 'opacity-100 text-primary'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
