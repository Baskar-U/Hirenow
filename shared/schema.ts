import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["Applicant", "Admin", "Bot Mimic"]);
export const jobTypeEnum = pgEnum("job_type", ["Technical", "Non-Technical"]);
export const applicationStatusEnum = pgEnum("application_status", [
  "Applied",
  "Reviewed",
  "Interview",
  "Offer",
  "Rejected",
]);

// Users table
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: userRoleEnum("role").notNull().default("Applicant"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Jobs table
export const jobs = pgTable("jobs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  description: text("description"),
  requirements: text("requirements"),
  requiredSkills: text("required_skills"), // JSON string array of skills
  type: jobTypeEnum("type").notNull(),
  createdById: integer("created_by_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Applications table
export const applications = pgTable("applications", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  jobId: integer("job_id").notNull().references(() => jobs.id),
  applicantId: integer("applicant_id").notNull().references(() => users.id),
  status: applicationStatusEnum("status").notNull().default("Applied"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Activity logs table
export const activityLogs = pgTable("activity_logs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  applicationId: integer("application_id").notNull().references(() => applications.id),
  action: text("action").notNull(),
  previousStatus: applicationStatusEnum("previous_status"),
  newStatus: applicationStatusEnum("new_status"),
  comment: text("comment"),
  updatedById: integer("updated_by_id").notNull().references(() => users.id),
  isAutomated: integer("is_automated").notNull().default(0), // 0 = manual, 1 = automated
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  createdJobs: many(jobs),
  applications: many(applications),
  activityLogs: many(activityLogs),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [jobs.createdById],
    references: [users.id],
  }),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
  applicant: one(users, {
    fields: [applications.applicantId],
    references: [users.id],
  }),
  activityLogs: many(activityLogs),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  application: one(applications, {
    fields: [activityLogs.applicationId],
    references: [applications.id],
  }),
  updatedBy: one(users, {
    fields: [activityLogs.updatedById],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  name: true,
  role: true,
});

export const insertJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  description: z.string().optional(),
  requirements: z.string().optional(),
  requiredSkills: z.array(z.string()).optional().default([]),
  type: z.enum(["Technical", "Non-Technical"]),
}).transform((data) => {
  console.log("=== ZOD SCHEMA TRANSFORM DEBUG ===");
  console.log("Input data:", data);
  console.log("requiredSkills before transform:", data.requiredSkills);
  const result = {
    ...data,
    requiredSkills: data.requiredSkills || []
  };
  console.log("requiredSkills after transform:", result.requiredSkills);
  console.log("=== END ZOD TRANSFORM DEBUG ===");
  return result;
});

export const insertApplicationSchema = createInsertSchema(applications).pick({
  jobId: true,
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["Applied", "Reviewed", "Interview", "Offer", "Rejected"]),
  comment: z.string().optional(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

export type ActivityLog = typeof activityLogs.$inferSelect;

export type UpdateApplicationStatus = z.infer<typeof updateApplicationStatusSchema>;
