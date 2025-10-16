import { config } from '../config';

const API_BASE_URL = config.API_BASE_URL;

const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("Login failed");
    return response.json();
  },

  // Jobs
  getJobs: async () => {
    const response = await fetch(`${API_BASE_URL}/api/jobs`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error("Failed to fetch jobs");
    return response.json();
  },

  createJob: async (job: any) => {
    console.log("=== API CREATE JOB DEBUG ===");
    console.log("Job data being sent to API:", job);
    console.log("requiredSkills in API call:", job.requiredSkills);
    console.log("=== END API DEBUG ===");
    
    const response = await fetch(`${API_BASE_URL}/api/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(job),
    });
    if (!response.ok) throw new Error("Failed to create job");
    const result = await response.json();
    console.log("=== API RESPONSE DEBUG ===");
    console.log("Response from server:", result);
    console.log("requiredSkills in response:", result.requiredSkills);
    console.log("=== END RESPONSE DEBUG ===");
    return result;
  },

  // Applications
  getMyApplications: async () => {
    const response = await fetch(`${API_BASE_URL}/api/applications/my`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error("Failed to fetch applications");
    return response.json();
  },

  getAllApplications: async () => {
    const response = await fetch(`${API_BASE_URL}/api/applications`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error("Failed to fetch applications");
    return response.json();
  },

  createApplication: async (jobId: number) => {
    const response = await fetch(`${API_BASE_URL}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ jobId }),
    });
    if (!response.ok) throw new Error("Failed to create application");
    return response.json();
  },

  createDetailedApplication: async (applicationData: any) => {
    console.log("=== FRONTEND API CALL DEBUG ===");
    console.log("Application data being sent:", applicationData);
    console.log("Auth header:", getAuthHeader());
    console.log("=== END FRONTEND API CALL DEBUG ===");
    
    const response = await fetch(`${API_BASE_URL}/api/applications/detailed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(applicationData),
    });
    
    console.log("=== FRONTEND API RESPONSE DEBUG ===");
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error response:", errorText);
      throw new Error("Failed to create application");
    }
    
    const result = await response.json();
    console.log("Success response:", result);
    console.log("=== END FRONTEND API RESPONSE DEBUG ===");
    return result;
  },

  updateApplicationStatus: async (
    id: number,
    status: string,
    comment?: string
  ) => {
    const response = await fetch(`${API_BASE_URL}/api/applications/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status, comment }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update status");
    }
    return response.json();
  },

  getActivities: async (applicationId: number) => {
    const response = await fetch(`${API_BASE_URL}/api/applications/${applicationId}/activities`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error("Failed to fetch activities");
    return response.json();
  },

  // Bot automation
  runAutomation: async () => {
    const response = await fetch(`${API_BASE_URL}/api/bot/automate`, {
      method: "POST",
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error("Automation failed");
    return response.json();
  },
};
