import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-full w-screen">
      <SidebarProvider className="">
        <AppSidebar />
        <div>
          {/* <SidebarTrigger /> */}
          {children}
        </div>
      </SidebarProvider>
    </div>
  );
}
