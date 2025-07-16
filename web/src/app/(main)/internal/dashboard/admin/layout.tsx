import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  if (!cookieStore.get('jwt')) {
    return redirect('/login')
  }
  return (
    <div className="w-[75vw] flex flex-col pl-4">
      {/* <AdminBreadcrumb /> */}
      {children}
    </div>
  )
}
