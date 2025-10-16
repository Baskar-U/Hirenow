import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { JobCard } from "@/components/JobCard";
import { ApplicationForm } from "@/components/ApplicationForm";

export default function NewApplication() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(new Set());
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: jobs = [] } = useQuery({
    queryKey: ["/api/jobs"],
    queryFn: api.getJobs,
  });

  const createMutation = useMutation({
    mutationFn: (applicationData: any) => api.createDetailedApplication(applicationData),
    onSuccess: (_, applicationData) => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications/my"] });
      setAppliedJobs(prev => new Set([...prev, applicationData.jobId]));
      setIsFormOpen(false);
      setSelectedJob(null);
      toast({
        title: "Success",
        description: "Application submitted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    },
  });

  const handleApply = (job: any) => {
    setSelectedJob(job);
    setIsFormOpen(true);
  };

  const handleSubmitApplication = (applicationData: any) => {
    createMutation.mutate(applicationData);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => setLocation("/dashboard")}
        data-testid="button-back"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Available Job Postings</CardTitle>
          <CardDescription>
            Browse available job postings and apply directly by clicking "Apply Now"
          </CardDescription>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No job postings available at the moment</p>
              <Button onClick={() => setLocation("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job: any) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  company={job.company}
                  description={job.description}
                  requirements={job.requirements}
                  requiredSkills={job.requiredSkills || []}
                  type={job.type}
                  createdAt={job.createdAt}
                  onApply={() => handleApply(job)}
                  isApplying={createMutation.isPending}
                  isApplied={appliedJobs.has(job.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedJob && (
        <ApplicationForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedJob(null);
          }}
          job={selectedJob}
          onSubmit={handleSubmitApplication}
          isSubmitting={createMutation.isPending}
        />
      )}
    </div>
  );
}
