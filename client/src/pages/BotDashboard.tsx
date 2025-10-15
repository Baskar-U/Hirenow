import { Bot, Zap, Activity, CheckCircle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MetricCard } from "@/components/MetricCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function BotDashboard() {
  const { toast } = useToast();

  const { data: applications = [] } = useQuery({
    queryKey: ["/api/applications"],
    queryFn: api.getAllApplications,
  });

  const runAutomation = useMutation({
    mutationFn: api.runAutomation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({
        title: "Success",
        description: data.message || "Automation completed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Automation failed",
        variant: "destructive",
      });
    },
  });

  const technicalApps = applications.filter((app: any) => app.job?.type === "Technical");
  const queueItems = technicalApps.filter((app: any) => 
    app.status === "Applied" || app.status === "Reviewed" || app.status === "Interview"
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Bot Mimic Dashboard</h1>
          <p className="text-muted-foreground mt-1">Automated application processing</p>
        </div>
        <Button
          onClick={() => runAutomation.mutate()}
          disabled={runAutomation.isPending}
          data-testid="button-run-automation"
        >
          <Zap className="h-4 w-4 mr-2" />
          {runAutomation.isPending ? "Running..." : "Run Automation"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Queue Size"
          value={queueItems.length}
          icon={Bot}
          description="Technical applications"
        />
        <MetricCard
          title="Total Technical"
          value={technicalApps.length}
          icon={CheckCircle}
        />
        <MetricCard
          title="Pending Review"
          value={technicalApps.filter((a: any) => a.status === "Applied").length}
          icon={Activity}
        />
        <MetricCard
          title="In Interview"
          value={technicalApps.filter((a: any) => a.status === "Interview").length}
          icon={Zap}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Automation Queue (Technical Roles)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {queueItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No items in queue</p>
            ) : (
              queueItems.map((app: any) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover-elevate"
                  data-testid={`queue-item-${app.id}`}
                >
                  <div className="flex-1">
                    <p className="font-medium" data-testid={`text-queue-applicant-${app.id}`}>
                      {app.applicant?.name || "Unknown Applicant"}
                    </p>
                    <p className="text-sm text-muted-foreground">{app.job?.title || "Unknown Job"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{app.status}</Badge>
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
