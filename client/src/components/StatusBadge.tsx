import { Badge } from "@/components/ui/badge";
import { Check, Clock, UserCheck, X, MessageSquare } from "lucide-react";

type StatusType = "Applied" | "Reviewed" | "Interview" | "Offer" | "Rejected";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
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

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} ${className || ""}`} data-testid={`badge-status-${status.toLowerCase()}`}>
      <Icon className="h-3 w-3 mr-1" />
      {status}
    </Badge>
  );
}
