import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { RoleBadge } from "./RoleBadge";
import { Calendar, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type StatusType = "Applied" | "Reviewed" | "Interview" | "Offer" | "Rejected";

interface ApplicationCardProps {
  id: string;
  jobTitle: string;
  company: string;
  status: StatusType;
  roleType: "Technical" | "Non-Technical";
  appliedDate: string;
  lastUpdate: string;
  onViewDetails?: () => void;
}

export function ApplicationCard({
  id,
  jobTitle,
  company,
  status,
  roleType,
  appliedDate,
  lastUpdate,
  onViewDetails,
}: ApplicationCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`card-application-${id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate" data-testid={`text-job-title-${id}`}>
              {jobTitle}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Building2 className="h-4 w-4" />
              <span data-testid={`text-company-${id}`}>{company}</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <StatusBadge status={status} />
            <RoleBadge type={roleType} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span data-testid={`text-applied-date-${id}`}>Applied {appliedDate}</span>
            </div>
            <div className="text-xs">
              Updated {lastUpdate}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            data-testid={`button-view-details-${id}`}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
