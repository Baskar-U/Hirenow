import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { RoleBadge } from "./RoleBadge";
import { Calendar, Building2, User, Mail, Phone, MapPin, FileText, Code, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

type StatusType = "Applied" | "Reviewed" | "Interview" | "Offer" | "Rejected";

interface ApplicationCardProps {
  id: string;
  jobTitle: string;
  company: string;
  status: StatusType;
  roleType: "Technical" | "Non-Technical";
  appliedDate: string;
  lastUpdate: string;
  // Job details
  jobDescription?: string;
  jobRequirements?: string;
  requiredSkills?: string[];
  // Applicant details
  applicantName?: string;
  applicantEmail?: string;
  applicantPhone?: string;
  applicantLocation?: string;
  coverLetter?: string;
  havingSkills?: string[];
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
  jobDescription,
  jobRequirements,
  requiredSkills = [],
  applicantName,
  applicantEmail,
  applicantPhone,
  applicantLocation,
  coverLetter,
  havingSkills = [],
  onViewDetails,
}: ApplicationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
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
      
      <CardContent className="space-y-4">
        {/* Basic Info */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span data-testid={`text-applied-date-${id}`}>Applied {appliedDate}</span>
            </div>
            <div className="text-xs">
              Updated {lastUpdate || "Recently"}
            </div>
          </div>
          <div className="flex gap-2">
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm">
                  {isExpanded ? "Show Less" : "Show More"}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
            <Button
              variant="outline"
              size="sm"
              onClick={onViewDetails}
              data-testid={`button-view-details-${id}`}
            >
              View Details
            </Button>
          </div>
        </div>

        {/* Expanded Details */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="space-y-4">
            {/* Job Details */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Job Details</h4>
              
              {jobDescription && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
                  <p className="text-sm text-foreground line-clamp-3">{jobDescription}</p>
                </div>
              )}

              {jobRequirements && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Requirements</p>
                  <p className="text-sm text-foreground line-clamp-2">{jobRequirements}</p>
                </div>
              )}

              {requiredSkills.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {requiredSkills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Applicant Details */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Your Application</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {applicantName && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{applicantName}</span>
                  </div>
                )}
                {applicantEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium truncate">{applicantEmail}</span>
                  </div>
                )}
                {applicantPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{applicantPhone}</span>
                  </div>
                )}
                {applicantLocation && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{applicantLocation}</span>
                  </div>
                )}
              </div>

              {coverLetter && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    Cover Letter
                  </p>
                  <p className="text-sm text-foreground line-clamp-3 bg-muted/50 p-2 rounded-md">
                    {coverLetter}
                  </p>
                </div>
              )}

              {havingSkills.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <Code className="h-3 w-3" />
                    Your Skills
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {havingSkills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Match Analysis */}
              {requiredSkills.length > 0 && havingSkills.length > 0 && (
                <div className="bg-muted/30 p-3 rounded-md">
                  <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Skills Match Analysis
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Matched:</span>
                      <span className="ml-1 font-medium">
                        {requiredSkills.filter(skill => havingSkills.includes(skill)).length} / {requiredSkills.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Match Rate:</span>
                      <span className="ml-1 font-medium">
                        {Math.round((requiredSkills.filter(skill => havingSkills.includes(skill)).length / requiredSkills.length) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
