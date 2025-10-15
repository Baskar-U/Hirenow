import { FileText, Users, Bot, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { MetricCard } from "@/components/MetricCard";
import { SimpleChart } from "@/components/SimpleChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  const { data: applications = [] } = useQuery({
    queryKey: ["/api/applications"],
    queryFn: api.getAllApplications,
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ["/api/jobs"],
    queryFn: api.getJobs,
  });

  const technicalCount = applications.filter((a: any) => a.job?.type === "Technical").length;
  const nonTechnicalCount = applications.filter((a: any) => a.job?.type === "Non-Technical").length;

  const recentApplications = applications.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage applications and job postings</p>
        </div>
        <Button onClick={() => setLocation("/admin/jobs")} data-testid="button-create-job">
          <Plus className="h-4 w-4 mr-2" />
          Create Job Posting
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Applications"
          value={applications.length}
          icon={FileText}
        />
        <MetricCard
          title="Active Job Postings"
          value={jobs.length}
          icon={Users}
        />
        <MetricCard
          title="Technical Roles"
          value={technicalCount}
          icon={Bot}
          description="Automated tracking"
        />
        <MetricCard
          title="Non-Technical Roles"
          value={nonTechnicalCount}
          icon={TrendingUp}
          description="Manual tracking"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SimpleChart
          title="Applications by Role Type"
          type="donut"
          data={[
            { label: "Technical", value: technicalCount || 1, color: "hsl(var(--chart-1))" },
            { label: "Non-Technical", value: nonTechnicalCount || 1, color: "hsl(var(--chart-3))" },
          ]}
        />
        <SimpleChart
          title="Application Status Distribution"
          data={[
            { label: "Applied", value: applications.filter((a: any) => a.status === "Applied").length || 1, color: "hsl(var(--status-applied))" },
            { label: "Reviewed", value: applications.filter((a: any) => a.status === "Reviewed").length || 1, color: "hsl(var(--status-in-progress))" },
            { label: "Interview", value: applications.filter((a: any) => a.status === "Interview").length || 1, color: "hsl(var(--status-interview))" },
            { label: "Offer", value: applications.filter((a: any) => a.status === "Offer").length || 1, color: "hsl(var(--status-success))" },
          ]}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentApplications.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No applications yet</p>
            ) : (
              recentApplications.map((app: any) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-3 rounded-lg hover-elevate border"
                  data-testid={`row-application-${app.id}`}
                >
                  <div className="flex-1">
                    <p className="font-medium" data-testid={`text-applicant-${app.id}`}>
                      {app.applicant?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-muted-foreground">{app.job?.title || "Unknown Role"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={app.status} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLocation("/admin/applications")}
                      data-testid={`button-review-${app.id}`}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
