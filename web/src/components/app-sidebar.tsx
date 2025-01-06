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
} from "@/components/ui/sidebar";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";

import {
  BookUser,
  ChartLine,
  ChevronDown,
  HousePlus,
  MailPlus,
  Settings,
  Users,
} from "lucide-react";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: ChartLine,
  },
  {
    title: "Proyectos",
    url: "/dashboard/projects",
    icon: HousePlus,
  },
  {
    title: "Clientes",
    url: "/dashboard/clients",
    icon: Users,
  },
  {
    title: "usuarios",
    url: "/dashboard/users",
    icon: BookUser,
  },
  /* {
    title: "Emails",
    url: "/dashboard/emails",
    icon: Inbox,
  },
  {
    title: "Clientes",
    url: "/dashboard/clients",
    icon: UserSearch,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  }, */
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

const adminItems = [
  {
    title: "Empresas",
    url: "/dashboard/admin/businesses",
    icon: Users,
  },
  {
    title: "Emails Automaticos",
    url: "/dashboard/admin/automatic-emails",
    icon: MailPlus,
  },
  {
    title: "Users",
    url: "/dashboard/admin/users",
    icon: Users,
  },
];

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
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

async function SideBarAdminGroup() {
  const cookieStore = await cookies();
  /* Make a sleep 2 secs */
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const jwt = cookieStore.get("jwt");
  if (!jwt) {
    return null;
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
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
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
      <SidebarFooter />
    </Sidebar>
  );
}
