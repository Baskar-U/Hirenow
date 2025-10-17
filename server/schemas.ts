import { z } from "zod";

// MongoDB-compatible validation schemas
export const USER_ROLES = ["Applicant", "Admin", "Bot Mimic"] as const;
export const JOB_TYPES = ["Technical", "Non-Technical"] as const;
export const APPLICATION_STATUSES = [
  "Applied",
  "Reviewed", 
  "Interview",
  "Offer",
  "Rejected",
] as const;

export const insertUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(USER_ROLES).optional().default("Applicant"),
});

export const insertJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  description: z.string().optional(),
  requirements: z.string().optional(),
  requiredSkills: z.array(z.string()).optional().default([]),
  type: z.enum(JOB_TYPES),
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

export const insertApplicationSchema = z.object({
  jobId: z.number().int().positive("Job ID must be a positive integer"),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(APPLICATION_STATUSES),
  comment: z.string().optional(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type UpdateApplicationStatus = z.infer<typeof updateApplicationStatusSchema>;
