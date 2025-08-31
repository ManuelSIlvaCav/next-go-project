import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { CollapsibleTrigger } from '@radix-ui/react-collapsible'

import {
  BookUser,
  ChartLine,
  ChevronDown,
  MailPlus,
  Settings,
  Shield,
  Users,
  WorkflowIcon,
} from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Suspense } from 'react'
import { ColorModeToggle } from './color-mode-toogle'
import { Collapsible, CollapsibleContent } from './ui/collapsible'

const items = [
  {
    title: 'Dashboard',
    url: '/internal/dashboard',
    icon: ChartLine,
  },
  {
    title: 'Insurance Plans',
    url: '/internal/dashboard/insurance',
    icon: Shield,
  },
  {
    title: 'Clientes',
    url: '/internal/dashboard/clients',
    icon: Users,
  },
  {
    title: 'usuarios',
    url: '/internal/dashboard/users',
    icon: BookUser,
  },
  /* {
    title: 'CMS',
    url: '/internal/dashboard/cms',
    icon: Layers,
  }, */
  /* {
    title: "Emails",
    url: "/internal/dashboard/emails",
    icon: Inbox,
  },
  {
    title: "Clientes",
    url: "/internal/dashboard/clients",
    icon: UserSearch,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  }, */
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
  },
]

const adminItems = [
  {
    title: 'Empresas',
    url: '/internal/dashboard/admin/businesses',
    icon: Users,
  },
  {
    title: 'Email Templates',
    url: '/internal/dashboard/admin/email-templates',
    icon: MailPlus,
  },
  {
    title: 'Acciones',
    url: '/internal/dashboard/admin/actions',
    icon: WorkflowIcon,
  },
  {
    title: 'Users',
    url: '/internal/dashboard/admin/users',
    icon: Users,
  },
]

function SideBarMainGroup() {
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger>
            Home
            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}

async function SideBarAdminGroup() {
  const cookieStore = await cookies()
  /* Make a sleep 2 secs */
  await new Promise((resolve) => setTimeout(resolve, 2000))
  const jwt = cookieStore.get('jwt')
  if (!jwt) {
    return null
  }

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger>
            Admin
            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader />
      <SidebarContent>
        <SideBarMainGroup />
        <Suspense fallback={<div></div>}>
          <SideBarAdminGroup />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex justify-end">
          <ColorModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
