import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApplicationCard } from "@/components/ApplicationCard";
import { ApplicationDetailsPanel } from "@/components/ApplicationDetailsPanel";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { api } from "@/lib/api";

export default function MyApplications() {
  const [, setLocation] = useLocation();
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: applications = [] } = useQuery({
    queryKey: ["/api/applications/my"],
    queryFn: api.getMyApplications,
  });

  const filteredApplications = applications.filter((app: any) => {
    const matchesSearch =
      app.job?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job?.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedApp = applications.find((app: any) => app.id === selectedAppId);

  const activitiesQueryEnabled = !!selectedAppId;
  const { data: activities = [] } = useQuery({
    queryKey: ["/api/applications", selectedAppId, "activities"],
    queryFn: () => api.getActivities(selectedAppId!),
    enabled: activitiesQueryEnabled,
  });

  const formatActivities = activities.map((activity: any) => ({
    action: activity.action,
    timestamp: new Date(activity.createdAt).toLocaleString(),
    updatedBy: activity.updatedBy?.name || "System",
    isBot: activity.isAutomated === 1,
    comment: activity.comment || undefined,
  }));

  // Debug: Log activities data
  console.log("=== ACTIVITIES DEBUG ===");
  console.log("Selected App ID:", selectedAppId);
  console.log("Raw activities:", activities);
  console.log("Formatted activities:", formatActivities);
  console.log("Activities length:", activities.length);
  console.log("=== END ACTIVITIES DEBUG ===");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="text-muted-foreground mt-1">View and track your applications</p>
        </div>
        <Button onClick={() => setLocation("/new-application")}>New Application</Button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <Input
          placeholder="Search applications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Applied">Applied</SelectItem>
            <SelectItem value="Reviewed">Reviewed</SelectItem>
            <SelectItem value="Interview">Interview</SelectItem>
            <SelectItem value="Offer">Offer</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No applications found</p>
            <Button onClick={() => setLocation("/new-application")}>Create Your First Application</Button>
          </div>
        ) : (
          filteredApplications.map((app: any) => (
            <ApplicationCard
              key={app.id}
              id={app.id.toString()}
              jobTitle={app.job?.title || "Unknown Job"}
              company={app.job?.company || "Unknown Company"}
              status={app.status}
              roleType={app.job?.type || "Technical"}
              appliedDate={new Date(app.createdAt).toLocaleDateString()}
              lastUpdate={app.updatedAt ? new Date(app.updatedAt).toLocaleDateString() : new Date(app.createdAt).toLocaleDateString()}
              // Job details
              jobDescription={app.job?.description}
              jobRequirements={app.job?.requirements}
              requiredSkills={app.job?.requiredSkills || []}
              // Applicant details
              applicantName={app.name}
              applicantEmail={app.email}
              applicantPhone={app.phone}
              applicantLocation={app.location}
              coverLetter={app.coverLetter}
              havingSkills={app.havingSkills || []}
              onViewDetails={() => setSelectedAppId(app.id)}
            />
          ))
        )}
      </div>

      {selectedApp && (
        <ApplicationDetailsPanel
          jobTitle={selectedApp.job?.title || "Unknown Job"}
          company={selectedApp.job?.company || "Unknown Company"}
          status={selectedApp.status}
          activities={formatActivities}
          onClose={() => setSelectedAppId(null)}
        />
      )}
    </div>
  );
}





