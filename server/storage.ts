import { UserModel, JobModel, ApplicationModel, ActivityLogModel } from "./models";

const normalizeStatus = (s?: string): string | undefined => {
  if (!s) return s;
  const map: Record<string, string> = {
    Submitted: "Applied",
    "Under Review": "Reviewed",
    "Interview Scheduled": "Interview",
    "Offer Extended": "Offer",
    Accepted: "Offer",
    Applied: "Applied",
    Reviewed: "Reviewed",
    Interview: "Interview",
    Offer: "Offer",
    Rejected: "Rejected",
  };
  return map[s] ?? s;
};

export interface IStorage {
  getUser(id: number): Promise<any | undefined>;
  getUserByEmail(email: string): Promise<any | undefined>;
  createUser(user: { email: string; password: string; name: string; role: string }): Promise<any>;

  createJob(job: { title: string; company: string; description?: string; requirements?: string; type: string }, createdById: number): Promise<any>;
  getJobs(): Promise<any[]>;
  getJobById(id: number): Promise<any | undefined>;

  createApplication(application: { jobId: number; status: string; resumeUrl?: string; coverLetter?: string }, applicantId: number): Promise<any>;
  createDetailedApplication(application: { 
    jobId: number; 
    name: string; 
    email: string; 
    phone?: string; 
    location?: string; 
    coverLetter?: string; 
    havingSkills?: string[] 
  }, applicantId: number): Promise<any>;
  getApplicationsByApplicant(applicantId: number): Promise<any[]>;
  getApplicationsByJob(jobId: number): Promise<any[]>;
  getAllApplications(): Promise<any[]>;
  getApplicationById(id: number): Promise<any | undefined>;
  updateApplicationStatus(
    id: number,
    status: string,
    updatedById: number,
    comment?: string,
    isAutomated?: boolean
  ): Promise<any>;

  getActivityLogsByApplication(applicationId: number): Promise<any[]>;
  createActivityLog(log: {
    applicationId: number;
    action: string;
    previousStatus?: string;
    newStatus?: string;
    comment?: string;
    updatedById: number;
    isAutomated?: boolean;
  }): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<any | undefined> {
    const user = await UserModel.findOne({ id }).lean();
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<any | undefined> {
    const user = await UserModel.findOne({ email }).lean();
    return user || undefined;
  }

  async createUser(user: { email: string; password: string; name: string; role: string }): Promise<any> {
    const created = await UserModel.create(user);
    return created.toObject();
  }

  async createJob(job: { title: string; company: string; description?: string; requirements?: string; requiredSkills?: string[]; type: string }, createdById: number): Promise<any> {
    console.log("=== STORAGE DEBUG ===");
    console.log("Storage createJob input:", { ...job, createdById });
    console.log("requiredSkills in input:", job.requiredSkills);
    console.log("Type of requiredSkills:", typeof job.requiredSkills);
    console.log("Is requiredSkills array?", Array.isArray(job.requiredSkills));
    
    // Ensure requiredSkills is always present
    const jobData = {
      ...job,
      requiredSkills: job.requiredSkills || [],
      createdById
    };
    console.log("Storage createJob processed data:", jobData);
    console.log("requiredSkills in processed data:", jobData.requiredSkills);
    
    const created = await JobModel.create(jobData);
    const result = created.toObject();
    console.log("Storage createJob result:", result);
    console.log("requiredSkills in result:", result.requiredSkills);
    console.log("=== END STORAGE DEBUG ===");
    return result;
  }

  async getJobs(): Promise<any[]> {
    const jobs = await JobModel.find().sort({ createdAt: -1 }).lean();
    return jobs;
  }

  async getJobById(id: number): Promise<any | undefined> {
    const job = await JobModel.findOne({ id }).lean();
    return job || undefined;
  }

  async createApplication(application: { jobId: number; status: string; resumeUrl?: string; coverLetter?: string }, applicantId: number): Promise<any> {
    const created = await ApplicationModel.create({ ...application, applicantId, status: normalizeStatus(application.status) || "Applied" });
    
    // Create initial activity log
    await this.createActivityLog({
      applicationId: created.id,
      action: "Application submitted",
      newStatus: "Applied",
      comment: `Application submitted for job ID ${application.jobId}`,
      updatedById: applicantId,
      isAutomated: false
    });
    
    return created.toObject();
  }

  async createDetailedApplication(application: { 
    jobId: number; 
    name: string; 
    email: string; 
    phone?: string; 
    location?: string; 
    coverLetter?: string; 
    havingSkills?: string[] 
  }, applicantId: number): Promise<any> {
    console.log("=== STORAGE CREATE DETAILED APPLICATION DEBUG ===");
    console.log("Application data:", application);
    console.log("Applicant ID:", applicantId);
    
    try {
      const created = await ApplicationModel.create({ 
        ...application, 
        applicantId,
        status: "Applied",
        havingSkills: application.havingSkills || []
      });
      console.log("Application created in DB:", created);
      
      // Create initial activity log
      const activityLog = await this.createActivityLog({
        applicationId: created.id,
        action: "Application submitted",
        newStatus: "Applied",
        comment: `Application submitted for job ID ${application.jobId}`,
        updatedById: applicantId,
        isAutomated: false
      });
      console.log("Activity log created:", activityLog);
      
      const result = created.toObject();
      console.log("Returning application:", result);
      console.log("=== END STORAGE CREATE DETAILED APPLICATION DEBUG ===");
      return result;
    } catch (error: any) {
      console.log("=== STORAGE CREATE DETAILED APPLICATION ERROR ===");
      console.log("Error message:", error.message);
      console.log("Error stack:", error.stack);
      console.log("=== END STORAGE CREATE DETAILED APPLICATION ERROR ===");
      throw error;
    }
  }

  async getApplicationsByApplicant(applicantId: number): Promise<any[]> {
    const apps = await ApplicationModel.find({ applicantId }).lean();
    return apps.map((a) => ({ ...a, status: normalizeStatus(a.status) }));
  }

  async getApplicationsByJob(jobId: number): Promise<any[]> {
    const apps = await ApplicationModel.find({ jobId }).lean();
    return apps.map((a) => ({ ...a, status: normalizeStatus(a.status) }));
  }

  async getAllApplications(): Promise<any[]> {
    const apps = await ApplicationModel.find().sort({ createdAt: -1 }).lean();
    return apps.map((a) => ({ ...a, status: normalizeStatus(a.status) }));
  }

  async getApplicationById(id: number): Promise<any | undefined> {
    const app = await ApplicationModel.findOne({ id }).lean();
    if (!app) return undefined;
    return { ...app, status: normalizeStatus(app.status) };
  }

  async updateApplicationStatus(
    id: number,
    status: string,
    updatedById: number,
    comment?: string,
    isAutomated?: boolean
  ): Promise<any> {
    console.log("=== UPDATE APPLICATION STATUS DEBUG ===");
    console.log("Application ID:", id);
    console.log("New Status:", status);
    console.log("Updated By ID:", updatedById);
    console.log("Comment:", comment);
    console.log("Is Automated:", isAutomated);
    
    const existing = await ApplicationModel.findOne({ id }).lean();
    if (!existing) {
      console.log("ERROR: Application not found");
      throw new Error("Application not found");
    }
    const previousStatus = normalizeStatus(existing.status);
    const newStatus = normalizeStatus(status)!;
    console.log("Previous Status:", previousStatus);
    console.log("Normalized New Status:", newStatus);

    const application = await ApplicationModel.findOneAndUpdate(
      { id },
      { $set: { status: newStatus } },
      { new: true }
    ).lean();
    console.log("Application updated successfully");

    const activityLog = await ActivityLogModel.create({
      applicationId: id,
      action: "Status Update",
      previousStatus,
      newStatus,
      comment,
      updatedById,
      isAutomated: Boolean(isAutomated),
    });
    console.log("Activity log created:", activityLog._id);
    console.log("=== END UPDATE APPLICATION STATUS DEBUG ===");

    return application;
  }

  async getActivityLogsByApplication(applicationId: number): Promise<any[]> {
    const logs = await ActivityLogModel.find({ applicationId }).sort({ createdAt: -1 }).lean();
    return logs;
  }

  async createActivityLog(log: {
    applicationId: number;
    action: string;
    previousStatus?: string;
    newStatus?: string;
    comment?: string;
    updatedById: number;
    isAutomated?: boolean;
  }): Promise<any> {
    const created = await ActivityLogModel.create({
      ...log,
      previousStatus: normalizeStatus(log.previousStatus),
      newStatus: normalizeStatus(log.newStatus),
    });
    return created.toObject();
  }
}

export const storage = new DatabaseStorage();
