import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { RoleBadge } from "@/components/RoleBadge";

export default function NewApplication() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  const { data: jobs = [] } = useQuery({
    queryKey: ["/api/jobs"],
    queryFn: api.getJobs,
  });

  const createMutation = useMutation({
    mutationFn: (jobId: number) => api.createApplication(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications/my"] });
      toast({
        title: "Success",
        description: "Application submitted successfully",
      });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId) {
      toast({
        title: "Error",
        description: "Please select a job",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate(parseInt(selectedJobId));
  };

  const selectedJob = jobs.find((job: any) => job.id === parseInt(selectedJobId));

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
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
          <CardTitle>Create New Application</CardTitle>
          <CardDescription>
            Select a job posting and submit your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="job">Select Job</Label>
              <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                <SelectTrigger id="job" data-testid="select-job">
                  <SelectValue placeholder="Choose a job posting" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job: any) => (
                    <SelectItem key={job.id} value={job.id.toString()}>
                      {job.title} - {job.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedJob && (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{selectedJob.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{selectedJob.company}</p>
                    </div>
                    <RoleBadge type={selectedJob.type} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedJob.description && (
                    <div>
                      <p className="text-sm font-medium">Description</p>
                      <p className="text-sm text-muted-foreground mt-1">{selectedJob.description}</p>
                    </div>
                  )}
                  {selectedJob.requirements && (
                    <div>
                      <p className="text-sm font-medium">Requirements</p>
                      <p className="text-sm text-muted-foreground mt-1">{selectedJob.requirements}</p>
                    </div>
                  )}
                  {selectedJob.type === "Technical" && (
                    <p className="text-xs text-status-bot bg-status-bot/10 p-2 rounded">
                      ✨ This is a Technical role - status updates will be automated by Bot Mimic
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/dashboard")}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!selectedJobId || createMutation.isPending} data-testid="button-submit">
                {createMutation.isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
