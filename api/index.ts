import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "../server/routes";
import { connectMongo } from "../server/mongo";

const app = express();

// Enable CORS for both development and production
app.use(cors({
  origin: [
    'https://hirenow-project.web.app',
    'http://localhost:5173', 
    'http://localhost:3000',
    'https://hirenow-bh6v.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
connectMongo().catch(console.error);

// Register API routes
registerRoutes(app);

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  console.error('Error:', err);
  res.status(status).json({ message });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;
