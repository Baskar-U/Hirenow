import { Check } from "lucide-react";

type StatusType = "Applied" | "Reviewed" | "Interview" | "Offer" | "Rejected";

interface StatusTimelineProps {
  currentStatus: StatusType;
  isRejected?: boolean;
}

const statuses: StatusType[] = ["Applied", "Reviewed", "Interview", "Offer"];

export function StatusTimeline({ currentStatus, isRejected }: StatusTimelineProps) {
  const currentIndex = statuses.indexOf(currentStatus);

  if (isRejected) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-status-rejected/10 border-2 border-status-rejected">
            <span className="text-status-rejected font-semibold">×</span>
          </div>
          <p className="text-sm font-medium mt-2 text-status-rejected">Application Rejected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4" data-testid="status-timeline">
      <div className="flex items-center justify-between">
        {statuses.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={status} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-background border-border text-muted-foreground"
                  }`}
                  data-testid={`timeline-step-${status.toLowerCase()}`}
                >
                  {isCompleted && <Check className="h-5 w-5" />}
                </div>
                <p
                  className={`text-xs mt-2 font-medium ${
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {status}
                </p>
              </div>
              {index < statuses.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-colors ${
                    isCompleted ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
