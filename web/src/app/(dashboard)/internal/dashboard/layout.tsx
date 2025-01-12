import CMSAuthProvider from '@/cms/providers/Auth'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()

  if (!cookieStore?.get('jwt')) {
    redirect('/internal/login')
  }

  return (
    <div className="max-w-full w-screen">
      <CMSAuthProvider>
        <SidebarProvider className="">
          <AppSidebar />
          <div>
            {/* <SidebarTrigger /> */}
            {children}
          </div>
        </SidebarProvider>
      </CMSAuthProvider>
    </div>
  )
}
