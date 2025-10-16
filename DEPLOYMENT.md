# HireNow Deployment Guide

## Problem
Your frontend is deployed to Firebase but can't connect to your local MongoDB server, causing "Failed to fetch" errors.

## Solution
You need to deploy both your backend and database to the cloud.

## Step 1: Set up MongoDB Atlas (Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/hirenow`)
5. Replace `<password>` with your actual password

## Step 2: Deploy Backend to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy your backend:
   ```bash
   vercel --prod
   ```

4. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Add environment variable: `MONGODB_URI` with your Atlas connection string

## Step 3: Update Frontend Configuration

1. Get your Vercel backend URL (something like `https://your-project.vercel.app`)

2. Update `client/src/config.ts`:
   ```typescript
   export const config = {
     API_BASE_URL: 'https://your-project.vercel.app',
   };
   ```

3. Rebuild and redeploy frontend:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## Alternative: Quick Fix for Testing

If you want to test quickly, you can temporarily update the config to use your local server:

```typescript
export const config = {
  API_BASE_URL: 'http://localhost:5000', // Your local server URL
};
```

But this will only work if you keep your local server running and accessible from the internet.

## Files Created/Modified

- `vercel.json` - Vercel deployment configuration
- `server/package.json` - Server dependencies
- `client/src/config.ts` - API configuration
- `client/src/lib/api.ts` - Updated to use configurable API base URL

## Next Steps

1. Set up MongoDB Atlas
2. Deploy backend to Vercel
3. Update frontend config with backend URL
4. Redeploy frontend
5. Test the full application
