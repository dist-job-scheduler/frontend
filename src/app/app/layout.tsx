import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard/AppSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
