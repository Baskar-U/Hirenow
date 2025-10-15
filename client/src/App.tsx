import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppSidebar } from "@/components/app-sidebar";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import ApplicantDashboard from "@/pages/ApplicantDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import BotDashboard from "@/pages/BotDashboard";
import NewApplication from "@/pages/NewApplication";
import JobPostings from "@/pages/JobPostings";
import AdminApplications from "@/pages/AdminApplications";

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Redirect to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { user } = useAuth();

  const style = {
    "--sidebar-width": "16rem",
  };

  if (!user) {
    return <Login />;
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar userRole={user.role} userName={user.name} />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto">
            <Switch>
              <Route path="/dashboard">
                <ProtectedRoute allowedRoles={["Applicant"]}>
                  <ApplicantDashboard />
                </ProtectedRoute>
              </Route>
              <Route path="/new-application">
                <ProtectedRoute allowedRoles={["Applicant"]}>
                  <NewApplication />
                </ProtectedRoute>
              </Route>
              
              <Route path="/admin/dashboard">
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              </Route>
              <Route path="/admin/jobs">
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <JobPostings />
                </ProtectedRoute>
              </Route>
              <Route path="/admin/applications">
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <AdminApplications />
                </ProtectedRoute>
              </Route>
              
              <Route path="/bot/dashboard">
                <ProtectedRoute allowedRoles={["Bot Mimic"]}>
                  <BotDashboard />
                </ProtectedRoute>
              </Route>
              
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <TooltipProvider>
            <Switch>
              <Route path="/" component={Login} />
              <Route>
                <AppContent />
              </Route>
            </Switch>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
