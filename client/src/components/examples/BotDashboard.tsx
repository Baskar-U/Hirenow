import BotDashboard from "../../pages/BotDashboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../app-sidebar";

export default function BotDashboardExample() {
  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar userRole="Bot Mimic" userName="Bot System" />
        <div className="flex-1 overflow-auto">
          <BotDashboard />
        </div>
      </div>
    </SidebarProvider>
  );
}
