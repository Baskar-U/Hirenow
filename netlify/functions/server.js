const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const mongoose = require('mongoose');

// Import your routes and middleware
const { registerRoutes } = require('../../server/routes');
const { connectMongo } = require('../../server/mongo');

const app = express();

// Enable CORS
app.use(cors({
  origin: [
    'https://hirenow.netlify.app',
    'https://your-app-name.netlify.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
connectMongo().catch(console.error);

// Register your API routes
registerRoutes(app);

// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Export the serverless function
module.exports.handler = serverless(app);
