import { Badge } from "@/components/ui/badge";
import { Check, Clock, UserCheck, X, MessageSquare } from "lucide-react";

type UiStatus = "Applied" | "Reviewed" | "Interview" | "Offer" | "Rejected";

type StatusBadgeProps = {
  status: string;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const mapToUiStatus: Record<string, UiStatus> = {
    Submitted: "Applied",
    "Under Review": "Reviewed",
    "Interview Scheduled": "Interview",
    "Offer Extended": "Offer",
    Accepted: "Offer",
    Applied: "Applied",
    Reviewed: "Reviewed",
    Interview: "Interview",
    Offer: "Offer",
    Rejected: "Rejected",
  };

  const normalized: UiStatus = mapToUiStatus[status] ?? "Applied";

  const statusConfig: Record<UiStatus, { icon: any; className: string }> = {
    Applied: {
      icon: Clock,
      className: "bg-status-applied text-status-applied-foreground",
    },
    Reviewed: {
      icon: MessageSquare,
      className: "bg-status-in-progress text-status-in-progress-foreground",
    },
    Interview: {
      icon: UserCheck,
      className: "bg-status-interview text-status-interview-foreground",
    },
    Offer: {
      icon: Check,
      className: "bg-status-success text-status-success-foreground",
    },
    Rejected: {
      icon: X,
      className: "bg-status-rejected text-status-rejected-foreground",
    },
  };

  const config = statusConfig[normalized];
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} ${className || ""}`} data-testid={`badge-status-${normalized.toLowerCase()}`}>
      <Icon className="h-3 w-3 mr-1" />
      {normalized}
    </Badge>
  );
}
