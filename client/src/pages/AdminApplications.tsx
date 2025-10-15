import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/StatusBadge";
import { RoleBadge } from "@/components/RoleBadge";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type StatusType = "Applied" | "Reviewed" | "Interview" | "Offer" | "Rejected";

export default function AdminApplications() {
  const { toast } = useToast();
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<StatusType>("Applied");
  const [comment, setComment] = useState("");

  const { data: applications = [] } = useQuery({
    queryKey: ["/api/applications"],
    queryFn: api.getAllApplications,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, comment }: { id: number; status: string; comment?: string }) =>
      api.updateApplicationStatus(id, status, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      setSelectedApp(null);
      setComment("");
      toast({
        title: "Success",
        description: "Application status updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const nonTechnicalApps = applications.filter((app: any) => app.job?.type === "Non-Technical");

  const handleUpdate = () => {
    if (!selectedApp) return;
    updateMutation.mutate({
      id: selectedApp.id,
      status: newStatus,
      comment,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Applications</h1>
        <p className="text-muted-foreground mt-1">Update status for Non-Technical applications</p>
      </div>

      <div className="space-y-3">
        {nonTechnicalApps.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No Non-Technical applications found</p>
            </CardContent>
          </Card>
        ) : (
          nonTechnicalApps.map((app: any) => (
            <Card key={app.id} data-testid={`card-application-${app.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <CardTitle className="text-lg" data-testid={`text-job-title-${app.id}`}>
                      {app.job?.title || "Unknown Job"}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Applicant: {app.applicant?.name || "Unknown"}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <StatusBadge status={app.status} />
                    <RoleBadge type={app.job?.type || "Non-Technical"} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <p className="text-sm text-muted-foreground">
                    Applied {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedApp(app);
                      setNewStatus(app.status);
                    }}
                    data-testid={`button-update-status-${app.id}`}
                  >
                    Update Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div>
                <p className="font-medium">{selectedApp.job?.title}</p>
                <p className="text-sm text-muted-foreground">
                  Applicant: {selectedApp.applicant?.name}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">New Status</Label>
                <Select value={newStatus} onValueChange={(value: any) => setNewStatus(value)}>
                  <SelectTrigger id="status" data-testid="select-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Reviewed">Reviewed</SelectItem>
                    <SelectItem value="Interview">Interview</SelectItem>
                    <SelectItem value="Offer">Offer</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Comment (Optional)</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a note about this status change..."
                  rows={3}
                  data-testid="textarea-comment"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setSelectedApp(null)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdate}
                  disabled={updateMutation.isPending}
                  data-testid="button-confirm-update"
                >
                  {updateMutation.isPending ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
