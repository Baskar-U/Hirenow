import { Bot, Zap, Activity, CheckCircle } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivityItem } from "@/components/ActivityItem";

//TODO: Remove mock data
const queueItems = [
  { id: 1, applicant: "John Doe", role: "Senior Developer", currentStatus: "Reviewed", nextStatus: "Interview" },
  { id: 2, applicant: "Alice Brown", role: "Backend Engineer", currentStatus: "Applied", nextStatus: "Reviewed" },
];

//TODO: Remove mock data
const recentActivities = [
  {
    action: "Status updated to Interview",
    timestamp: "Oct 14, 2025 10:30 AM",
    updatedBy: "Bot Mimic",
    isBot: true,
    comment: "Automatic progression after review completion",
  },
  {
    action: "Status updated to Reviewed",
    timestamp: "Oct 14, 2025 9:15 AM",
    updatedBy: "Bot Mimic",
    isBot: true,
  },
];

export default function BotDashboard() {
  const handleRunAutomation = () => {
    console.log("Running automation...");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Bot Mimic Dashboard</h1>
          <p className="text-muted-foreground mt-1">Automated application processing</p>
        </div>
        <Button onClick={handleRunAutomation} data-testid="button-run-automation">
          <Zap className="h-4 w-4 mr-2" />
          Run Automation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Queue Size"
          value={queueItems.length}
          icon={Bot}
        />
        <MetricCard
          title="Processed Today"
          value={12}
          icon={CheckCircle}
          trend={{ value: 20, isPositive: true }}
        />
        <MetricCard
          title="Success Rate"
          value="96%"
          icon={Activity}
        />
        <MetricCard
          title="Avg Processing Time"
          value="2.3s"
          icon={Zap}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Automation Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {queueItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg border hover-elevate"
                data-testid={`queue-item-${item.id}`}
              >
                <div className="flex-1">
                  <p className="font-medium" data-testid={`text-queue-applicant-${item.id}`}>{item.applicant}</p>
                  <p className="text-sm text-muted-foreground">{item.role}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{item.currentStatus}</Badge>
                    <span className="text-muted-foreground">→</span>
                    <Badge className="bg-status-bot text-status-bot-foreground">{item.nextStatus}</Badge>
                  </div>
                  <Button variant="outline" size="sm" data-testid={`button-process-${item.id}`}>
                    Process
                  </Button>
                </div>
              </div>
            ))}
            {queueItems.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No items in queue</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Automation Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivities.map((activity, index) => (
            <ActivityItem key={index} {...activity} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
