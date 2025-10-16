import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { RoleBadge } from "@/components/RoleBadge";

export default function JobPostings() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    requirements: "",
    requiredSkills: [] as string[],
    type: "Technical" as "Technical" | "Non-Technical",
  });

  const availableSkills = [
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust",
    "React", "Vue.js", "Angular", "Node.js", "Express", "Django", "Flask",
    "Spring Boot", "Laravel", "Ruby on Rails", "ASP.NET", "FastAPI",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "SQLite",
    "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Terraform",
    "Git", "CI/CD", "Jenkins", "GitHub Actions", "GitLab CI",
    "REST API", "GraphQL", "gRPC", "Microservices", "Serverless",
    "Machine Learning", "Data Science", "TensorFlow", "PyTorch", "Pandas",
    "HTML", "CSS", "SASS", "Tailwind CSS", "Bootstrap", "Material-UI",
    "Linux", "Windows", "macOS", "Bash", "PowerShell",
    "Agile", "Scrum", "Kanban", "DevOps", "Testing", "Jest", "Cypress"
  ];

  const { data: jobs = [] } = useQuery({
    queryKey: ["/api/jobs"],
    queryFn: api.getJobs,
  });

  // Debug: Log jobs data
  console.log("=== ADMIN JOBS DEBUG ===");
  console.log("Jobs data:", jobs);
  jobs.forEach((job, index) => {
    console.log(`Job ${index + 1}:`, {
      id: job.id,
      title: job.title,
      requiredSkills: job.requiredSkills,
      hasRequiredSkills: 'requiredSkills' in job
    });
  });
  console.log("=== END ADMIN DEBUG ===");

  const createMutation = useMutation({
    mutationFn: api.createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      setIsOpen(false);
      setFormData({
        title: "",
        company: "",
        description: "",
        requirements: "",
        requiredSkills: [],
        type: "Technical",
      });
      toast({
        title: "Success",
        description: "Job posting created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create job posting",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure requiredSkills is always present
    const dataToSubmit = {
      ...formData,
      requiredSkills: formData.requiredSkills || []
    };
    console.log("=== FORM SUBMISSION DEBUG ===");
    console.log("Original formData:", formData);
    console.log("Data to submit:", dataToSubmit);
    console.log("requiredSkills array:", dataToSubmit.requiredSkills);
    console.log("requiredSkills length:", dataToSubmit.requiredSkills.length);
    console.log("requiredSkills type:", typeof dataToSubmit.requiredSkills);
    console.log("Is requiredSkills array?", Array.isArray(dataToSubmit.requiredSkills));
    console.log("=== END FORM DEBUG ===");
    createMutation.mutate(dataToSubmit);
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter(s => s !== skill)
        : [...prev.requiredSkills, skill]
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Postings</h1>
          <p className="text-muted-foreground mt-1">Create and manage job postings</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-job">
              <Plus className="h-4 w-4 mr-2" />
              Create Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Job Posting</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    data-testid="input-job-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                    data-testid="input-company"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Job Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="type" data-testid="select-job-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical">Technical (Automated)</SelectItem>
                    <SelectItem value="Non-Technical">Non-Technical (Manual)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  data-testid="textarea-description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={3}
                  data-testid="textarea-requirements"
                />
              </div>
              <div className="space-y-3">
                <Label>Required Skills</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto border rounded-md p-4">
                  {availableSkills.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={`skill-${skill}`}
                        checked={formData.requiredSkills.includes(skill)}
                        onCheckedChange={() => handleSkillToggle(skill)}
                        data-testid={`checkbox-skill-${skill}`}
                      />
                      <Label
                        htmlFor={`skill-${skill}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {skill}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.requiredSkills.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Selected: {formData.requiredSkills.join(", ")}
                  </div>
                )}
              </div>
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} data-testid="button-cancel">
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit">
                  {createMutation.isPending ? "Creating..." : "Create Job"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {jobs.map((job: any) => (
          <Card key={job.id} data-testid={`card-job-${job.id}`} className="hover-elevate">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg" data-testid={`text-job-title-${job.id}`}>{job.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{job.company}</p>
                </div>
                <RoleBadge type={job.type} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {job.description && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{job.description}</p>
                </div>
              )}
              
              {job.requirements && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Requirements</h4>
                  <p className="text-sm text-muted-foreground">{job.requirements}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium mb-2">Required Skills</h4>
                {job.requiredSkills && job.requiredSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {job.requiredSkills.map((skill: string) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No specific skills required</p>
                )}
              </div>
              
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  Created {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
