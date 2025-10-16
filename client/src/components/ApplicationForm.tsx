import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleBadge } from "@/components/RoleBadge";
import { Building2, Calendar, X } from "lucide-react";

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: number;
    title: string;
    company: string;
    description?: string;
    requirements?: string;
    requiredSkills?: string[];
    type: string;
    createdAt: string;
  };
  onSubmit: (applicationData: any) => void;
  isSubmitting?: boolean;
}

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

export function ApplicationForm({ isOpen, onClose, job, onSubmit, isSubmitting = false }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    coverLetter: "",
    havingSkills: [] as string[],
  });

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      havingSkills: prev.havingSkills.includes(skill)
        ? prev.havingSkills.filter(s => s !== skill)
        : [...prev.havingSkills, skill]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      jobId: job.id,
      ...formData,
    });
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      location: "",
      coverLetter: "",
      havingSkills: [],
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Apply for Position</span>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Job Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Job Details</h3>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Building2 className="h-4 w-4" />
                      <span>{job.company}</span>
                    </div>
                  </div>
                  <RoleBadge type={job.type} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {job.description && (
                  <div>
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-sm text-muted-foreground">{job.description}</p>
                  </div>
                )}
                {job.requirements && (
                  <div>
                    <p className="text-sm font-medium">Requirements</p>
                    <p className="text-sm text-muted-foreground">{job.requirements}</p>
                  </div>
                )}
                {job.requiredSkills && job.requiredSkills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Required Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {job.requiredSkills.map((skill) => (
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
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Details</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Enter your location"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Textarea
                  id="coverLetter"
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  rows={4}
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>

              <div className="space-y-3">
                <Label>Your Skills</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                  {availableSkills.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={`skill-${skill}`}
                        checked={formData.havingSkills.includes(skill)}
                        onCheckedChange={() => handleSkillToggle(skill)}
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
                {formData.havingSkills.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Selected: {formData.havingSkills.join(", ")}
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
