import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppSidebar } from "@/components/app-sidebar";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import ApplicantDashboard from "@/pages/ApplicantDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import BotDashboard from "@/pages/BotDashboard";
import NewApplication from "@/pages/NewApplication";

//TODO: Remove mock user data - implement real authentication
const mockUser = {
  name: "John Doe",
  role: "Applicant" as const,
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      
      {/* Applicant routes */}
      <Route path="/dashboard" component={ApplicantDashboard} />
      <Route path="/new-application" component={NewApplication} />
      
      {/* Admin routes */}
      <Route path="/admin/dashboard" component={AdminDashboard} />
      
      {/* Bot Mimic routes */}
      <Route path="/bot/dashboard" component={BotDashboard} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <Switch>
              {/* Login page without sidebar */}
              <Route path="/" component={Login} />
              
              {/* All other pages with sidebar */}
              <Route>
                <div className="flex h-screen w-full">
                  <AppSidebar userRole={mockUser.role} userName={mockUser.name} />
                  <div className="flex flex-col flex-1">
                    <header className="flex items-center justify-between p-4 border-b">
                      <SidebarTrigger data-testid="button-sidebar-toggle" />
                      <ThemeToggle />
                    </header>
                    <main className="flex-1 overflow-auto">
                      <Router />
                    </main>
                  </div>
                </div>
              </Route>
            </Switch>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
