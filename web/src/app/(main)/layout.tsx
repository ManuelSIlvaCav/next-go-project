import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import clsx from 'clsx'
import type { Metadata } from 'next'
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
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={`antialiased` + clsx(latto.variable, fredoka.variable)}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <NavBar /> */}
          <InnerClientInit>{children}</InnerClientInit>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
