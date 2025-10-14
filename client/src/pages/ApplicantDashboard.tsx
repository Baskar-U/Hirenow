import { useState } from "react";
import { FileText, Clock, CheckCircle, XCircle, Plus } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { ApplicationCard } from "@/components/ApplicationCard";
import { ApplicationDetailsPanel } from "@/components/ApplicationDetailsPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SimpleChart } from "@/components/SimpleChart";
import { useLocation } from "wouter";

//TODO: Remove mock data
const mockApplications = [
  {
    id: "1",
    jobTitle: "Senior Full Stack Developer",
    company: "TechCorp Inc.",
    status: "Interview" as const,
    roleType: "Technical" as const,
    appliedDate: "Oct 10, 2025",
    lastUpdate: "2 hours ago",
  },
  {
    id: "2",
    jobTitle: "Frontend Engineer",
    company: "StartupXYZ",
    status: "Reviewed" as const,
    roleType: "Technical" as const,
    appliedDate: "Oct 8, 2025",
    lastUpdate: "1 day ago",
  },
  {
    id: "3",
    jobTitle: "Marketing Manager",
    company: "Growth Solutions",
    status: "Applied" as const,
    roleType: "Non-Technical" as const,
    appliedDate: "Oct 12, 2025",
    lastUpdate: "3 hours ago",
  },
];

//TODO: Remove mock data
const mockActivities = [
  {
    action: "Status changed to Interview",
    timestamp: "Oct 14, 2025 10:30 AM",
    updatedBy: "Bot Mimic",
    isBot: true,
    comment: "Application automatically progressed after technical screening completion",
  },
  {
    action: "Status changed to Reviewed",
    timestamp: "Oct 13, 2025 2:15 PM",
    updatedBy: "John Admin",
    comment: "Initial screening completed. Moving to next stage.",
  },
  {
    action: "Application submitted",
    timestamp: "Oct 10, 2025 9:00 AM",
    updatedBy: "System",
  },
];

export default function ApplicantDashboard() {
  const [, setLocation] = useLocation();
  const [selectedApp, setSelectedApp] = useState<typeof mockApplications[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your job applications</p>
        </div>
        <Button onClick={() => setLocation("/new-application")} data-testid="button-new-application">
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Applications"
          value={mockApplications.length}
          icon={FileText}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="In Progress"
          value={mockApplications.filter(a => a.status === "Reviewed" || a.status === "Interview").length}
          icon={Clock}
        />
        <MetricCard
          title="Interviews"
          value={mockApplications.filter(a => a.status === "Interview").length}
          icon={CheckCircle}
        />
        <MetricCard
          title="Rejected"
          value={0}
          icon={XCircle}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SimpleChart
          title="Applications by Status"
          type="donut"
          data={[
            { label: "Applied", value: 1, color: "hsl(var(--status-applied))" },
            { label: "Reviewed", value: 1, color: "hsl(var(--status-in-progress))" },
            { label: "Interview", value: 1, color: "hsl(var(--status-interview))" },
          ]}
        />
        <SimpleChart
          title="Applications by Type"
          data={[
            { label: "Technical", value: 2, color: "hsl(var(--chart-1))" },
            { label: "Non-Technical", value: 1, color: "hsl(var(--chart-3))" },
          ]}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <Input
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
            data-testid="input-search"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-filter">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Reviewed">Reviewed</SelectItem>
              <SelectItem value="Interview">Interview</SelectItem>
              <SelectItem value="Offer">Offer</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {filteredApplications.map((app) => (
            <ApplicationCard
              key={app.id}
              {...app}
              onViewDetails={() => setSelectedApp(app)}
            />
          ))}
        </div>
      </div>

      {selectedApp && (
        <ApplicationDetailsPanel
          jobTitle={selectedApp.jobTitle}
          company={selectedApp.company}
          status={selectedApp.status}
          activities={mockActivities}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
}
