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
} from "./schemas";

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
        console.log("=== JOB CREATION DEBUG ===");
        console.log("1. Received job data:", JSON.stringify(req.body, null, 2));
        console.log("2. requiredSkills in request:", req.body.requiredSkills);
        console.log("3. Type of requiredSkills:", typeof req.body.requiredSkills);
        console.log("4. Is requiredSkills array?", Array.isArray(req.body.requiredSkills));
        
        const data = insertJobSchema.parse(req.body);
        console.log("5. Parsed job data:", JSON.stringify(data, null, 2));
        console.log("6. requiredSkills after parsing:", data.requiredSkills);
        
        const job = await storage.createJob(data, req.user!.id);
        console.log("7. Created job:", JSON.stringify(job, null, 2));
        console.log("8. requiredSkills in created job:", job.requiredSkills);
        console.log("=== END DEBUG ===");
        
        res.json(job);
      } catch (error: any) {
        console.error("Job creation error:", error);
        res.status(400).json({ error: error.message || "Failed to create job" });
      }
    }
  );

  app.get("/api/jobs", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const jobs = await storage.getJobs();
      console.log("=== FETCHING JOBS DEBUG ===");
      console.log("Number of jobs:", jobs.length);
      jobs.forEach((job, index) => {
        console.log(`Job ${index + 1} (ID: ${job.id}):`, {
          title: job.title,
          requiredSkills: job.requiredSkills,
          hasRequiredSkills: 'requiredSkills' in job,
          requiredSkillsType: typeof job.requiredSkills
        });
      });
      console.log("=== END FETCH DEBUG ===");
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

  app.post(
    "/api/applications/detailed",
    authMiddleware,
    requireRole("Applicant"),
    async (req: AuthRequest, res) => {
      try {
        console.log("=== DETAILED APPLICATION CREATION DEBUG ===");
        console.log("Request body:", req.body);
        console.log("User ID:", req.user!.id);
        console.log("User role:", req.user!.role);
        
        const { jobId, name, email, phone, location, coverLetter, havingSkills } = req.body;
        
        if (!jobId || !name || !email) {
          console.log("ERROR: Missing required fields - jobId:", jobId, "name:", name, "email:", email);
          return res.status(400).json({ error: "Job ID, name, and email are required" });
        }

        console.log("Creating detailed application with data:", {
          jobId,
          name,
          email,
          phone,
          location,
          coverLetter,
          havingSkills: havingSkills || []
        });

        const application = await storage.createDetailedApplication({
          jobId,
          name,
          email,
          phone,
          location,
          coverLetter,
          havingSkills: havingSkills || []
        }, req.user!.id);
        
        console.log("Application created successfully:", application);
        console.log("=== END DETAILED APPLICATION CREATION DEBUG ===");
        
        res.json(application);
      } catch (error: any) {
        console.log("=== DETAILED APPLICATION CREATION ERROR ===");
        console.log("Error message:", error.message);
        console.log("Error code:", error.code);
        console.log("Error name:", error.name);
        console.log("Error stack:", error.stack);
        if (error.code === 11000) {
          console.log("DUPLICATE KEY ERROR - This is likely an ID generation issue");
        }
        console.log("=== END DETAILED APPLICATION CREATION ERROR ===");
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
    async (_req: AuthRequest, res) => {
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

        console.log("=== ACTIVITIES API DEBUG ===");
        console.log("Application ID:", req.params.id);
        console.log("Raw activities from DB:", activities);
        console.log("Activities count:", activities.length);

        // Fetch user details for each activity
        const activitiesWithUsers = await Promise.all(
          activities.map(async (activity) => {
            const user = await storage.getUser(activity.updatedById);
            return { ...activity, updatedBy: user };
          })
        );

        console.log("Activities with users:", activitiesWithUsers);
        console.log("=== END ACTIVITIES API DEBUG ===");

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
        const errors: { id: number; error: string }[] = [];

        console.log("=== BOT AUTOMATION DEBUG ===");
        console.log("Total applications found:", applications.length);
        console.log("Bot user ID:", req.user!.id);
        console.log("Bot user role:", req.user!.role);
        console.log("Applications:", applications.map(app => ({ id: app.id, jobId: app.jobId, status: app.status })));
        
        // Check if we have any Technical applications
        const technicalApps = [];
        for (const app of applications) {
          const job = await storage.getJobById(app.jobId);
          if (job?.type === "Technical") {
            technicalApps.push({ id: app.id, jobId: app.jobId, status: app.status, jobType: job.type });
          }
        }
        console.log("Technical applications found:", technicalApps.length);
        console.log("Technical apps:", technicalApps);
        
        for (const app of applications) {
          try {
            const job = await storage.getJobById(app.jobId);
            console.log(`Processing application ${app.id}: job type = ${job?.type}, current status = ${app.status}`);
            
            // Only process Technical applications
            if (job?.type === "Technical") {
              let newStatus = app.status;
              let automationComment = "";

              // Automation logic: progress through stages
              switch (app.status) {
                case "Applied":
                  // Check skills match rate before moving to Reviewed
                  const requiredSkills = job.requiredSkills || [];
                  const havingSkills = app.havingSkills || [];
                  
                  if (requiredSkills.length > 0 && havingSkills.length > 0) {
                    const matchedSkills = requiredSkills.filter(skill => havingSkills.includes(skill));
                    const matchRate = (matchedSkills.length / requiredSkills.length) * 100;
                    
                    if (matchRate >= 50) {
                      newStatus = "Reviewed";
                      automationComment = `Skills match rate: ${Math.round(matchRate)}% (${matchedSkills.length}/${requiredSkills.length} skills matched). Automatically progressed to Reviewed.`;
                    } else {
                      automationComment = `Skills match rate: ${Math.round(matchRate)}% (${matchedSkills.length}/${requiredSkills.length} skills matched). Below 50% threshold, keeping as Applied.`;
                    }
                  } else {
                    // No skills data available, proceed with normal automation
                    newStatus = "Reviewed";
                    automationComment = "No skills data available. Automatically progressed to Reviewed.";
                  }
                  break;
                case "Reviewed":
                  newStatus = "Interview";
                  automationComment = `Automatically progressed from ${app.status} to ${newStatus}`;
                  break;
                case "Interview":
                  newStatus = "Offer";
                  automationComment = `Automatically progressed from ${app.status} to ${newStatus}`;
                  break;
                default:
                  continue;
              }

              if (newStatus !== app.status) {
                console.log(`Updating application ${app.id} from ${app.status} to ${newStatus}`);
                console.log(`Comment: ${automationComment}`);
                const updated = await storage.updateApplicationStatus(
                  app.id,
                  newStatus,
                  req.user!.id,
                  automationComment,
                  true
                );
                console.log(`Successfully updated application ${app.id}`);
                processed.push(updated);
              } else if (automationComment) {
                // Log the decision even if status didn't change
                console.log(`Logging decision for application ${app.id}: ${automationComment}`);
                await storage.updateApplicationStatus(
                  app.id,
                  app.status,
                  req.user!.id,
                  automationComment,
                  true
                );
                console.log(`Successfully logged decision for application ${app.id}`);
              }
            }
          } catch (err: any) {
            errors.push({ id: app.id, error: err?.message || String(err) });
            continue;
          }
        }

        console.log("=== BOT AUTOMATION SUMMARY ===");
        console.log("Processed applications:", processed.length);
        console.log("Errors:", errors.length);
        console.log("Processed details:", processed.map(p => ({ id: p.id, status: p.status })));
        console.log("Error details:", errors);
        console.log("=== END BOT AUTOMATION SUMMARY ===");

        res.json({
          message: `Processed ${processed.length} applications` + (errors.length ? `, ${errors.length} errors` : ""),
          processed,
          errors,
        });
      } catch (error: any) {
        res.status(500).json({ error: error.message || "Automation failed" });
      }
    }
  );

  const httpServer = createServer(app);
  return httpServer;
}
