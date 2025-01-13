'use client'

import { AppBreadCrumb } from '@/components/breadcrumb'
import { usePathname } from 'next/navigation'

const nameDictionary = {
  businesses: 'Negocio',
  create: 'Crear Negocio',
  'automatic-emails': 'Emails Automáticos',
}

export default function AdminBreadcrumb() {
  const pathname = usePathname()

  /* Parse the pathname from /dashboard/admin onwards */
  const path = pathname.split('/').slice(4)

  const items = path.map((segment, index) => {
    const href = '/internal/dashboard/admin/' + path.slice(0, index + 1).join('/')
    const key = (segment.charAt(0) + segment.slice(1)) as keyof typeof nameDictionary

    return { name: nameDictionary[key] ?? key, href }
  })

  const currentPage = items.pop() || {
    name: 'Admin',
    href: '/dashboard/admin',
  }

  return <AppBreadCrumb items={[...items]} page={currentPage} />
}
