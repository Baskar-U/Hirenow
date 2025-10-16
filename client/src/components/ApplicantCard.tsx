import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, User, Mail, Phone, MapPin, FileText, Code, CheckCircle } from "lucide-react";
import { useState } from "react";

interface ApplicantCardProps {
  application: {
    id: number;
    status: string;
    applicant?: {
      name: string;
      email: string;
    };
    job?: {
      title: string;
      company: string;
      requiredSkills?: string[];
    };
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    coverLetter?: string;
    havingSkills?: string[];
  };
}

export function ApplicantCard({ application }: ApplicantCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const applicantName = application.applicant?.name || application.name || "Unknown Applicant";
  const applicantEmail = application.applicant?.email || application.email || "";
  const jobTitle = application.job?.title || "Unknown Job";
  const company = application.job?.company || "Unknown Company";
  const requiredSkills = application.job?.requiredSkills || [];
  const havingSkills = application.havingSkills || [];
  
  // Calculate match rate
  const matchedSkills = requiredSkills.filter(skill => havingSkills.includes(skill));
  const matchRate = requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) * 100 : 0;
  const isReadyForReview = matchRate >= 50;

  return (
    <Card className="hover-elevate">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {applicantName}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {jobTitle} at {company}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {application.status}
                  </Badge>
                  {havingSkills.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {havingSkills.length} skills
                    </Badge>
                  )}
                  {application.status === "Applied" && requiredSkills.length > 0 && (
                    <Badge 
                      variant={isReadyForReview ? "default" : "destructive"} 
                      className="text-xs"
                    >
                      {isReadyForReview ? "Ready for Review" : "Needs Review"}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Contact Information */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {applicantEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{applicantEmail}</span>
                  </div>
                )}
                {application.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{application.phone}</span>
                  </div>
                )}
                {application.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{application.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Letter */}
            {application.coverLetter && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Cover Letter
                </h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                  {application.coverLetter}
                </p>
              </div>
            )}

            {/* Skills Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Required Skills */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Required Skills
                </h4>
                {requiredSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {requiredSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No specific skills required</p>
                )}
              </div>

              {/* Having Skills */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Applicant Skills
                </h4>
                {havingSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {havingSkills.map((skill) => {
                      const isRequired = requiredSkills.includes(skill);
                      return (
                        <Badge
                          key={skill}
                          variant={isRequired ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {skill}
                          {isRequired && " ✓"}
                        </Badge>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No skills specified</p>
                )}
              </div>
            </div>

            {/* Skills Match Analysis */}
            {requiredSkills.length > 0 && havingSkills.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Skills Match Analysis</h4>
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">Matched Skills:</span>
                      <span className="ml-2 font-medium">
                        {matchedSkills.length} / {requiredSkills.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Match Rate:</span>
                      <span className="ml-2 font-medium">
                        {Math.round(matchRate)}%
                      </span>
                    </div>
                  </div>
                  {application.status === "Applied" && (
                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Automation Status:</span>
                        <Badge 
                          variant={isReadyForReview ? "default" : "destructive"} 
                          className="text-xs"
                        >
                          {isReadyForReview 
                            ? `Ready for Review (≥50% match)` 
                            : `Needs Manual Review (<50% match)`
                          }
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
