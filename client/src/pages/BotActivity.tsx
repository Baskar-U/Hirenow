import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

export default function BotActivity() {
  const { data: applications = [] } = useQuery({
    queryKey: ["/api/applications"],
    queryFn: api.getAllApplications,
  });

  const activityItems = applications.flatMap((app: any) =>
    (app.activities || []).map((a: any) => ({
      id: a.id,
      applicationId: app.id,
      jobTitle: app.job?.title,
      applicant: app.applicant?.name,
      action: a.action,
      status: a.newStatus,
      at: new Date(a.createdAt).toLocaleString(),
    }))
  );

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activityItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No recent activity</p>
            ) : (
              activityItems.map((item) => (
                <div key={item.id} className="p-4 rounded-lg border">
                  <div className="font-medium">{item.action} → {item.status}</div>
                  <div className="text-sm text-muted-foreground">
                    App #{item.applicationId} • {item.applicant} • {item.jobTitle} • {item.at}
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





