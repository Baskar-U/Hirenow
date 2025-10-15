const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("Login failed");
    return response.json();
  },

  // Jobs
  getJobs: async () => {
    const response = await fetch("/api/jobs", {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error("Failed to fetch jobs");
    return response.json();
  },

  createJob: async (job: any) => {
    const response = await fetch("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(job),
    });
    if (!response.ok) throw new Error("Failed to create job");
    return response.json();
  },

  // Applications
  getMyApplications: async () => {
    const response = await fetch("/api/applications/my", {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error("Failed to fetch applications");
    return response.json();
  },

  getAllApplications: async () => {
    const response = await fetch("/api/applications", {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error("Failed to fetch applications");
    return response.json();
  },

  createApplication: async (jobId: number) => {
    const response = await fetch("/api/applications", {
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

  updateApplicationStatus: async (
    id: number,
    status: string,
    comment?: string
  ) => {
    const response = await fetch(`/api/applications/${id}/status`, {
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
    const response = await fetch(`/api/applications/${applicationId}/activities`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error("Failed to fetch activities");
    return response.json();
  },

  // Bot automation
  runAutomation: async () => {
    const response = await fetch("/api/bot/automate", {
      method: "POST",
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error("Automation failed");
    return response.json();
  },
};
