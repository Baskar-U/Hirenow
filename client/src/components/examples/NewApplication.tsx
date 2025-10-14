import NewApplication from "../../pages/NewApplication";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../app-sidebar";

export default function NewApplicationExample() {
  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar userRole="Applicant" userName="John Doe" />
        <div className="flex-1 overflow-auto">
          <NewApplication />
        </div>
      </div>
    </SidebarProvider>
  );
}
