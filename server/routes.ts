import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  hashPassword,
  comparePassword,
  generateToken,
  authMiddleware,
  requireRole,
  type AuthRequest,
} from "./auth";
import { seedUsers } from "./seed";
import {
  insertUserSchema,
  insertJobSchema,
  insertApplicationSchema,
  updateApplicationStatusSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed initial users
  await seedUsers();

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(data.email);

      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const hashedPassword = await hashPassword(data.password);
      const user = await storage.createUser({
        ...data,
        password: hashedPassword,
      });

      const token = generateToken(user);
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = generateToken(user);
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Login failed" });
    }
  });

  app.get("/api/auth/me", authMiddleware, async (req: AuthRequest, res) => {
    res.json({
      id: req.user!.id,
      email: req.user!.email,
      name: req.user!.name,
      role: req.user!.role,
    });
  });

  // Job routes
  app.post(
    "/api/jobs",
    authMiddleware,
    requireRole("Admin"),
    async (req: AuthRequest, res) => {
      try {
        const data = insertJobSchema.parse(req.body);
        const job = await storage.createJob(data, req.user!.id);
        res.json(job);
      } catch (error: any) {
        res.status(400).json({ error: error.message || "Failed to create job" });
      }
    }
  );

  app.get("/api/jobs", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const jobs = await storage.getJobs();
      res.json(jobs);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const job = await storage.getJobById(parseInt(req.params.id));
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json(job);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch job" });
    }
  });

  // Application routes
  app.post(
    "/api/applications",
    authMiddleware,
    requireRole("Applicant"),
    async (req: AuthRequest, res) => {
      try {
        const data = insertApplicationSchema.parse(req.body);
        const application = await storage.createApplication(data, req.user!.id);
        res.json(application);
      } catch (error: any) {
        res.status(400).json({ error: error.message || "Failed to create application" });
      }
    }
  );

  app.get(
    "/api/applications/my",
    authMiddleware,
    requireRole("Applicant"),
    async (req: AuthRequest, res) => {
      try {
        const applications = await storage.getApplicationsByApplicant(req.user!.id);
        
        // Fetch job details for each application
        const applicationsWithJobs = await Promise.all(
          applications.map(async (app) => {
            const job = await storage.getJobById(app.jobId);
            return { ...app, job };
          })
        );

        res.json(applicationsWithJobs);
      } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch applications" });
      }
    }
  );

  app.get(
    "/api/applications",
    authMiddleware,
    requireRole("Admin", "Bot Mimic"),
    async (req: AuthRequest, res) => {
      try {
        const applications = await storage.getAllApplications();
        
        // Fetch related data
        const applicationsWithDetails = await Promise.all(
          applications.map(async (app) => {
            const job = await storage.getJobById(app.jobId);
            const applicant = await storage.getUser(app.applicantId);
            return { ...app, job, applicant };
          })
        );

        res.json(applicationsWithDetails);
      } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch applications" });
      }
    }
  );

  app.get(
    "/api/applications/:id",
    authMiddleware,
    async (req: AuthRequest, res) => {
      try {
        const application = await storage.getApplicationById(parseInt(req.params.id));
        if (!application) {
          return res.status(404).json({ error: "Application not found" });
        }

        // Check permissions
        if (
          req.user!.role === "Applicant" &&
          application.applicantId !== req.user!.id
        ) {
          return res.status(403).json({ error: "Access denied" });
        }

        const job = await storage.getJobById(application.jobId);
        const applicant = await storage.getUser(application.applicantId);

        res.json({ ...application, job, applicant });
      } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch application" });
      }
    }
  );

  // Update application status (Admin for non-technical, Bot Mimic for technical)
  app.patch(
    "/api/applications/:id/status",
    authMiddleware,
    requireRole("Admin", "Bot Mimic"),
    async (req: AuthRequest, res) => {
      try {
        const data = updateApplicationStatusSchema.parse(req.body);
        const application = await storage.getApplicationById(parseInt(req.params.id));
        
        if (!application) {
          return res.status(404).json({ error: "Application not found" });
        }

        const job = await storage.getJobById(application.jobId);
        if (!job) {
          return res.status(404).json({ error: "Job not found" });
        }

        // Check role permissions
        if (req.user!.role === "Admin" && job.type === "Technical") {
          return res.status(403).json({
            error: "Admin can only update Non-Technical applications",
          });
        }

        if (req.user!.role === "Bot Mimic" && job.type === "Non-Technical") {
          return res.status(403).json({
            error: "Bot Mimic can only update Technical applications",
          });
        }

        const isAutomated = req.user!.role === "Bot Mimic";
        const updated = await storage.updateApplicationStatus(
          parseInt(req.params.id),
          data.status,
          req.user!.id,
          data.comment,
          isAutomated
        );

        res.json(updated);
      } catch (error: any) {
        res.status(400).json({ error: error.message || "Failed to update status" });
      }
    }
  );

  // Activity logs
  app.get(
    "/api/applications/:id/activities",
    authMiddleware,
    async (req: AuthRequest, res) => {
      try {
        const application = await storage.getApplicationById(parseInt(req.params.id));
        if (!application) {
          return res.status(404).json({ error: "Application not found" });
        }

        // Check permissions
        if (
          req.user!.role === "Applicant" &&
          application.applicantId !== req.user!.id
        ) {
          return res.status(403).json({ error: "Access denied" });
        }

        const activities = await storage.getActivityLogsByApplication(
          parseInt(req.params.id)
        );

        // Fetch user details for each activity
        const activitiesWithUsers = await Promise.all(
          activities.map(async (activity) => {
            const user = await storage.getUser(activity.updatedById);
            return { ...activity, updatedBy: user };
          })
        );

        res.json(activitiesWithUsers);
      } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch activities" });
      }
    }
  );

  // Bot Mimic automation endpoint
  app.post(
    "/api/bot/automate",
    authMiddleware,
    requireRole("Bot Mimic"),
    async (req: AuthRequest, res) => {
      try {
        const applications = await storage.getAllApplications();
        const processed: any[] = [];

        for (const app of applications) {
          const job = await storage.getJobById(app.jobId);
          
          // Only process Technical applications
          if (job?.type === "Technical") {
            let newStatus = app.status;

            // Automation logic: progress through stages
            switch (app.status) {
              case "Applied":
                newStatus = "Reviewed";
                break;
              case "Reviewed":
                newStatus = "Interview";
                break;
              case "Interview":
                newStatus = "Offer";
                break;
              default:
                continue;
            }

            if (newStatus !== app.status) {
              const updated = await storage.updateApplicationStatus(
                app.id,
                newStatus,
                req.user!.id,
                `Automatically progressed from ${app.status} to ${newStatus}`,
                true
              );
              processed.push(updated);
            }
          }
        }

        res.json({
          message: `Processed ${processed.length} applications`,
          processed,
        });
      } catch (error: any) {
        res.status(500).json({ error: error.message || "Automation failed" });
      }
    }
  );

  const httpServer = createServer(app);
  return httpServer;
}
