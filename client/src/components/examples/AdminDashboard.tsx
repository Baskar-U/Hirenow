import AdminDashboard from "../../pages/AdminDashboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../app-sidebar";

export default function AdminDashboardExample() {
  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar userRole="Admin" userName="Admin User" />
        <div className="flex-1 overflow-auto">
          <AdminDashboard />
        </div>
      </div>
    </SidebarProvider>
  );
}
