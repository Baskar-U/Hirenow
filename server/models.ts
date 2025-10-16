import mongoose, { Schema } from "mongoose";

export const USER_ROLES = ["Applicant", "Admin", "Bot Mimic"] as const;
export const JOB_TYPES = ["Technical", "Non-Technical"] as const;
export const APPLICATION_STATUSES = [
  "Applied",
  "Reviewed",
  "Interview",
  "Offer",
  "Rejected",
] as const;

type Role = typeof USER_ROLES[number];

type JobType = typeof JOB_TYPES[number];

type AppStatus = typeof APPLICATION_STATUSES[number];

const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, required: true },
});
export const CounterModel = mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

async function getNextSequence(name: string): Promise<number> {
  let attempts = 0;
  const maxAttempts = 5;
  
  while (attempts < maxAttempts) {
    try {
      const updated = await CounterModel.findByIdAndUpdate(
        name,
        { $inc: { seq: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      
      // Initialize to 1 if new
      if (!updated.seq) {
        updated.seq = 1;
        await updated.save();
      }
      
      return updated.seq;
    } catch (error: any) {
      attempts++;
      if (error.code === 11000 && attempts < maxAttempts) {
        // Duplicate key error, retry after a short delay
        console.log(`Retrying sequence generation for ${name} (attempt ${attempts})`);
        await new Promise(resolve => setTimeout(resolve, 100));
        continue;
      }
      throw error;
    }
  }
  
  throw new Error(`Failed to generate sequence for ${name} after ${maxAttempts} attempts`);
}

const UserSchema = new Schema(
  {
    id: { type: Number, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: USER_ROLES, required: true, default: "Applicant" },
    createdAt: { type: Date, default: Date.now, required: true },
  },
  { versionKey: false }
);

UserSchema.pre("save", async function (next) {
  if (this.isNew && this.get("id") == null) {
    const nextId = await getNextSequence("users");
    this.set("id", nextId);
  }
  next();
});

const JobSchema = new Schema(
  {
    id: { type: Number, unique: true, index: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String },
    requirements: { type: String },
    requiredSkills: { type: [String], default: [], required: true },
    type: { type: String, enum: JOB_TYPES, required: true },
    createdById: { type: Number, required: true, index: true },
    createdAt: { type: Date, default: Date.now, required: true },
  },
  { versionKey: false }
);

JobSchema.pre("save", async function (next) {
  if (this.isNew && this.get("id") == null) {
    const nextId = await getNextSequence("jobs");
    this.set("id", nextId);
  }
  next();
});

const ApplicationSchema = new Schema(
  {
    id: { type: Number, unique: true, index: true },
    jobId: { type: Number, required: true, index: true },
    applicantId: { type: Number, required: true, index: true },
    status: { type: String, enum: APPLICATION_STATUSES, required: true, default: "Applied" },
    // Applicant details
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    location: { type: String },
    coverLetter: { type: String },
    havingSkills: { type: [String], default: [] },
    resumeUrl: { type: String },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now, required: true },
  },
  { versionKey: false }
);

ApplicationSchema.pre("save", async function (next) {
  if (this.isNew && this.get("id") == null) {
    const nextId = await getNextSequence("applications");
    this.set("id", nextId);
  }
  // Update the updatedAt field on every save
  this.set("updatedAt", new Date());
  next();
});

const ActivityLogSchema = new Schema(
  {
    id: { type: Number, unique: true, index: true },
    applicationId: { type: Number, required: true, index: true },
    action: { type: String, required: true },
    previousStatus: { type: String, enum: APPLICATION_STATUSES },
    newStatus: { type: String, enum: APPLICATION_STATUSES },
    comment: { type: String },
    updatedById: { type: Number, required: true, index: true },
    isAutomated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, required: true },
  },
  { versionKey: false }
);

ActivityLogSchema.pre("save", async function (next) {
  if (this.isNew && this.get("id") == null) {
    const nextId = await getNextSequence("activitylogs");
    this.set("id", nextId);
  }
  next();
});

// Ensure models are refreshed with latest schemas in dev
if (mongoose.models.User) mongoose.deleteModel("User");
if (mongoose.models.Job) mongoose.deleteModel("Job");
if (mongoose.models.Application) mongoose.deleteModel("Application");
if (mongoose.models.ActivityLog) mongoose.deleteModel("ActivityLog");

export const UserModel = mongoose.model("User", UserSchema);
export const JobModel = mongoose.model("Job", JobSchema);
export const ApplicationModel = mongoose.model("Application", ApplicationSchema);
export const ActivityLogModel = mongoose.model("ActivityLog", ActivityLogSchema);

