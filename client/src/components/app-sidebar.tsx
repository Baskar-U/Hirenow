import { Home, FileText, Bot, Settings, PlusCircle, BarChart3 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";

interface AppSidebarProps {
  userRole: "Applicant" | "Admin" | "Bot Mimic";
  userName: string;
}

const menuItems = {
  Applicant: [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "My Applications", url: "/applications", icon: FileText },
    { title: "New Application", url: "/new-application", icon: PlusCircle },
  ],
  Admin: [
    { title: "Dashboard", url: "/admin/dashboard", icon: Home },
    { title: "Job Postings", url: "/admin/jobs", icon: FileText },
    { title: "Applications", url: "/admin/applications", icon: BarChart3 },
    { title: "Settings", url: "/admin/settings", icon: Settings },
  ],
  "Bot Mimic": [
    { title: "Dashboard", url: "/bot/dashboard", icon: Home },
    { title: "Automation Queue", url: "/bot/queue", icon: Bot },
    { title: "Activity Log", url: "/bot/activity", icon: BarChart3 },
  ],
};

export function AppSidebar({ userRole, userName }: AppSidebarProps) {
  const [location] = useLocation();
  const items = menuItems[userRole];

  const roleColors = {
    Applicant: "bg-primary/10 text-primary border-primary/20",
    Admin: "bg-destructive/10 text-destructive border-destructive/20",
    "Bot Mimic": "bg-status-bot/10 text-status-bot border-status-bot/20",
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate" data-testid="text-user-name">{userName}</p>
            <Badge variant="outline" className={`${roleColors[userRole]} text-xs mt-1`} data-testid="badge-user-role">
              {userRole}
            </Badge>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground">
          Application Tracking System
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
