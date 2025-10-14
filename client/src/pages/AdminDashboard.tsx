import { FileText, Users, Bot, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { SimpleChart } from "@/components/SimpleChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

//TODO: Remove mock data
const recentApplications = [
  { id: 1, applicant: "John Doe", role: "Senior Developer", status: "Reviewed", time: "2h ago" },
  { id: 2, applicant: "Jane Smith", role: "Marketing Manager", status: "Interview", time: "5h ago" },
  { id: 3, applicant: "Bob Johnson", role: "Product Manager", status: "Applied", time: "1d ago" },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage applications and job postings</p>
        </div>
        <Button data-testid="button-create-job">
          <Plus className="h-4 w-4 mr-2" />
          Create Job Posting
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Applications"
          value={47}
          icon={FileText}
          trend={{ value: 15, isPositive: true }}
        />
        <MetricCard
          title="Active Job Postings"
          value={12}
          icon={Users}
        />
        <MetricCard
          title="Automated Updates"
          value={28}
          icon={Bot}
          description="This month"
        />
        <MetricCard
          title="Success Rate"
          value="64%"
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SimpleChart
          title="Applications by Role Type"
          type="donut"
          data={[
            { label: "Technical", value: 28, color: "hsl(var(--chart-1))" },
            { label: "Non-Technical", value: 19, color: "hsl(var(--chart-3))" },
          ]}
        />
        <SimpleChart
          title="Automation vs Manual Updates"
          data={[
            { label: "Automated", value: 28, color: "hsl(var(--status-bot))" },
            { label: "Manual", value: 19, color: "hsl(var(--chart-2))" },
          ]}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentApplications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between p-3 rounded-lg hover-elevate border"
                data-testid={`row-application-${app.id}`}
              >
                <div className="flex-1">
                  <p className="font-medium" data-testid={`text-applicant-${app.id}`}>{app.applicant}</p>
                  <p className="text-sm text-muted-foreground">{app.role}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{app.time}</span>
                  <Button variant="outline" size="sm" data-testid={`button-review-${app.id}`}>
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
