import AdminBreadcrumb from './admin-breadcrumb'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[75vw] flex flex-col pl-4">
      <AdminBreadcrumb />
      {children}
    </div>
  )
}
