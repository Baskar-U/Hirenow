import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, Clock, CheckCircle, XCircle, Plus } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { ApplicationCard } from "@/components/ApplicationCard";
import { ApplicationDetailsPanel } from "@/components/ApplicationDetailsPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SimpleChart } from "@/components/SimpleChart";
import { useLocation } from "wouter";
import { api } from "@/lib/api";

export default function ApplicantDashboard() {
  const [, setLocation] = useLocation();
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: applications = [] } = useQuery({
    queryKey: ["/api/applications/my"],
    queryFn: api.getMyApplications,
  });

  const { data: activities = [] } = useQuery({
    queryKey: ["/api/applications", selectedAppId, "activities"],
    queryFn: () => api.getActivities(selectedAppId!),
    enabled: !!selectedAppId,
  });

  const selectedApp = applications.find((app: any) => app.id === selectedAppId);

  const filteredApplications = applications.filter((app: any) => {
    const matchesSearch =
      app.job?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job?.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    applied: applications.filter((a: any) => a.status === "Applied").length,
    inProgress: applications.filter(
      (a: any) => a.status === "Reviewed" || a.status === "Interview"
    ).length,
    interview: applications.filter((a: any) => a.status === "Interview").length,
    rejected: applications.filter((a: any) => a.status === "Rejected").length,
  };

  const formatActivities = activities.map((activity: any) => ({
    action: activity.action,
    timestamp: new Date(activity.createdAt).toLocaleString(),
    updatedBy: activity.updatedBy?.name || "System",
    isBot: activity.isAutomated === 1,
    comment: activity.comment || undefined,
  }));

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
          value={applications.length}
          icon={FileText}
        />
        <MetricCard title="In Progress" value={statusCounts.inProgress} icon={Clock} />
        <MetricCard title="Interviews" value={statusCounts.interview} icon={CheckCircle} />
        <MetricCard title="Rejected" value={statusCounts.rejected} icon={XCircle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SimpleChart
          title="Applications by Status"
          type="donut"
          data={[
            {
              label: "Applied",
              value: statusCounts.applied || 1,
              color: "hsl(var(--status-applied))",
            },
            {
              label: "In Progress",
              value: statusCounts.inProgress || 1,
              color: "hsl(var(--status-in-progress))",
            },
            {
              label: "Interview",
              value: statusCounts.interview || 1,
              color: "hsl(var(--status-interview))",
            },
          ]}
        />
        <SimpleChart
          title="Applications by Type"
          data={[
            {
              label: "Technical",
              value: applications.filter((a: any) => a.job?.type === "Technical").length || 1,
              color: "hsl(var(--chart-1))",
            },
            {
              label: "Non-Technical",
              value:
                applications.filter((a: any) => a.job?.type === "Non-Technical").length || 1,
              color: "hsl(var(--chart-3))",
            },
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
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No applications found</p>
              <Button onClick={() => setLocation("/new-application")}>
                Create Your First Application
              </Button>
            </div>
          ) : (
            filteredApplications.map((app: any) => (
              <ApplicationCard
                key={app.id}
                id={app.id.toString()}
                jobTitle={app.job?.title || "Unknown Job"}
                company={app.job?.company || "Unknown Company"}
                status={app.status}
                roleType={app.job?.type || "Technical"}
                appliedDate={new Date(app.createdAt).toLocaleDateString()}
                lastUpdate={new Date(app.updatedAt).toLocaleDateString()}
                onViewDetails={() => setSelectedAppId(app.id)}
              />
            ))
          )}
        </div>
      </div>

      {selectedApp && (
        <ApplicationDetailsPanel
          jobTitle={selectedApp.job?.title || "Unknown Job"}
          company={selectedApp.job?.company || "Unknown Company"}
          status={selectedApp.status}
          activities={formatActivities}
          onClose={() => setSelectedAppId(null)}
        />
      )}
    </div>
  );
}
