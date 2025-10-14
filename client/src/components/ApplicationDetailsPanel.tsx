import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusTimeline } from "./StatusTimeline";
import { ActivityItem } from "./ActivityItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Activity {
  action: string;
  timestamp: string;
  updatedBy: string;
  isBot?: boolean;
  comment?: string;
}

interface ApplicationDetailsPanelProps {
  jobTitle: string;
  company: string;
  status: "Applied" | "Reviewed" | "Interview" | "Offer" | "Rejected";
  activities: Activity[];
  onClose: () => void;
}

export function ApplicationDetailsPanel({
  jobTitle,
  company,
  status,
  activities,
  onClose,
}: ApplicationDetailsPanelProps) {
  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-background border-l shadow-xl z-50">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="font-semibold text-lg" data-testid="text-panel-job-title">{jobTitle}</h2>
            <p className="text-sm text-muted-foreground" data-testid="text-panel-company">{company}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-panel">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Application Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <StatusTimeline
                  currentStatus={status}
                  isRejected={status === "Rejected"}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                {activities.map((activity, index) => (
                  <ActivityItem key={index} {...activity} />
                ))}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
