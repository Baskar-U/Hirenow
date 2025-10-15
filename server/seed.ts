import { storage } from "./storage";
import { hashPassword } from "./auth";

export async function seedUsers() {
  try {
    // Check if users already exist
    const existingApplicant = await storage.getUserByEmail("applicant@example.com");
    if (existingApplicant) {
      console.log("Users already seeded");
      return;
    }

    // Create sample users
    const hashedPassword = await hashPassword("password123");

    await storage.createUser({
      email: "applicant@example.com",
      password: hashedPassword,
      name: "John Applicant",
      role: "Applicant",
    });

    await storage.createUser({
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin User",
      role: "Admin",
    });

    await storage.createUser({
      email: "bot@example.com",
      password: hashedPassword,
      name: "Bot Mimic",
      role: "Bot Mimic",
    });

    console.log("Sample users created successfully!");
    console.log("Login credentials:");
    console.log("- Applicant: applicant@example.com / password123");
    console.log("- Admin: admin@example.com / password123");
    console.log("- Bot Mimic: bot@example.com / password123");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
}
