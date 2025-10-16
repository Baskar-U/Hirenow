// Configuration for API endpoints
export const config = {
  // For development, use empty string to make relative requests to local server
  // For production, use Netlify Functions
  API_BASE_URL: import.meta.env.VITE_API_URL || '',
  
  // Netlify Functions automatically handle /api/* routes
  // No need to specify full URL for Netlify deployment
};
