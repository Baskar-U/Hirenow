import {
  users,
  jobs,
  applications,
  activityLogs,
  type User,
  type InsertUser,
  type Job,
  type InsertJob,
  type Application,
  type InsertApplication,
  type ActivityLog,
  type UpdateApplicationStatus,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Job operations
  createJob(job: InsertJob, createdById: number): Promise<Job>;
  getJobs(): Promise<Job[]>;
  getJobById(id: number): Promise<Job | undefined>;

  // Application operations
  createApplication(application: InsertApplication, applicantId: number): Promise<Application>;
  getApplicationsByApplicant(applicantId: number): Promise<Application[]>;
  getApplicationsByJob(jobId: number): Promise<Application[]>;
  getAllApplications(): Promise<Application[]>;
  getApplicationById(id: number): Promise<Application | undefined>;
  updateApplicationStatus(
    id: number,
    status: string,
    updatedById: number,
    comment?: string,
    isAutomated?: boolean
  ): Promise<Application>;

  // Activity log operations
  getActivityLogsByApplication(applicationId: number): Promise<ActivityLog[]>;
  createActivityLog(log: {
    applicationId: number;
    action: string;
    previousStatus?: string;
    newStatus?: string;
    comment?: string;
    updatedById: number;
    isAutomated?: boolean;
  }): Promise<ActivityLog>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createJob(insertJob: InsertJob, createdById: number): Promise<Job> {
    const [job] = await db
      .insert(jobs)
      .values({ ...insertJob, createdById })
      .returning();
    return job;
  }

  async getJobs(): Promise<Job[]> {
    return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  }

  async getJobById(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  async createApplication(
    insertApplication: InsertApplication,
    applicantId: number
  ): Promise<Application> {
    const [application] = await db
      .insert(applications)
      .values({ ...insertApplication, applicantId })
      .returning();

    // Create initial activity log
    await this.createActivityLog({
      applicationId: application.id,
      action: "Application submitted",
      newStatus: "Applied",
      updatedById: applicantId,
      isAutomated: false,
    });

    return application;
  }

  async getApplicationsByApplicant(applicantId: number): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.applicantId, applicantId))
      .orderBy(desc(applications.createdAt));
  }

  async getApplicationsByJob(jobId: number): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.jobId, jobId))
      .orderBy(desc(applications.createdAt));
  }

  async getAllApplications(): Promise<Application[]> {
    return await db.select().from(applications).orderBy(desc(applications.createdAt));
  }

  async getApplicationById(id: number): Promise<Application | undefined> {
    const [application] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, id));
    return application || undefined;
  }

  async updateApplicationStatus(
    id: number,
    status: string,
    updatedById: number,
    comment?: string,
    isAutomated: boolean = false
  ): Promise<Application> {
    const application = await this.getApplicationById(id);
    if (!application) {
      throw new Error("Application not found");
    }

    const previousStatus = application.status;

    const [updated] = await db
      .update(applications)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning();

    // Create activity log
    await this.createActivityLog({
      applicationId: id,
      action: `Status changed to ${status}`,
      previousStatus,
      newStatus: status,
      comment,
      updatedById,
      isAutomated,
    });

    return updated;
  }

  async getActivityLogsByApplication(applicationId: number): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.applicationId, applicationId))
      .orderBy(desc(activityLogs.createdAt));
  }

  async createActivityLog(log: {
    applicationId: number;
    action: string;
    previousStatus?: string;
    newStatus?: string;
    comment?: string;
    updatedById: number;
    isAutomated?: boolean;
  }): Promise<ActivityLog> {
    const [activityLog] = await db
      .insert(activityLogs)
      .values({
        ...log,
        isAutomated: log.isAutomated ? 1 : 0,
      } as any)
      .returning();
    return activityLog;
  }
}

export const storage = new DatabaseStorage();
