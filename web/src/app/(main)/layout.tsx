import QueryProvider from '@/components/providers/query-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/hooks/use-auth'
import clsx from 'clsx'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import '../globals.css'
import InnerClientInit from './inner-client-init'
import { fredoka, latto } from './internal/dashboard/fonts'

export const metadata: Metadata = {
  title: 'Petza Marketplace',
  description: 'Encuentra todo para tu mascota',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`antialiased` + clsx(latto.variable, fredoka.variable)}>
      <body>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <AuthProvider>
              <NextIntlClientProvider>
                <InnerClientInit>{children}</InnerClientInit>
              </NextIntlClientProvider>
              <Toaster richColors expand={true} />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
