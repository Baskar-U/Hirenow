import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/RoleBadge";
import { Building2, Calendar } from "lucide-react";

interface JobCardProps {
  id: number;
  title: string;
  company: string;
  description?: string;
  requirements?: string;
  requiredSkills?: string[];
  type: string;
  createdAt: string;
  onApply: (jobId: number) => void;
  isApplying?: boolean;
  isApplied?: boolean;
}

export function JobCard({
  id,
  title,
  company,
  description,
  requirements,
  requiredSkills = [],
  type,
  createdAt,
  onApply,
  isApplying = false,
  isApplied = false,
}: JobCardProps) {
  return (
    <Card className="hover-elevate transition-all duration-200 hover:shadow-md" data-testid={`card-job-${id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate" data-testid={`text-job-title-${id}`}>
              {title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Building2 className="h-4 w-4" />
              <span data-testid={`text-company-${id}`}>{company}</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <RoleBadge type={type} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {description && (
          <div>
            <p className="text-sm font-medium">Description</p>
            <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
          </div>
        )}
        {requirements && (
          <div>
            <p className="text-sm font-medium">Requirements</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{requirements}</p>
          </div>
        )}
        {requiredSkills && requiredSkills.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Required Skills</p>
            <div className="flex flex-wrap gap-1">
              {requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {type === "Technical" && (
          <p className="text-xs text-status-bot bg-status-bot/10 p-2 rounded">
            ✨ This is a Technical role - status updates will be automated by Bot Mimic
          </p>
        )}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Posted {new Date(createdAt).toLocaleDateString()}</span>
          </div>
          <Button
            onClick={() => onApply(id)}
            disabled={isApplying || isApplied}
            data-testid={`button-apply-${id}`}
            className="min-w-[100px]"
          >
            {isApplied ? "Applied" : isApplying ? "Applying..." : "Apply Now"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
