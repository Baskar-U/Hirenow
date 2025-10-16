// Configuration for API endpoints
export const config = {
  // For development, use empty string to make relative requests to local server
  // For production, set this to your deployed backend URL
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  
  // Example production URLs:
  // API_BASE_URL: 'https://your-backend.vercel.app',
  // API_BASE_URL: 'https://your-backend.herokuapp.com',
  // API_BASE_URL: 'https://your-backend.railway.app',
};
