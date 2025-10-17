# Vercel Full-Stack Deployment 🚀

## Option 2: Deploy Everything on Vercel

Since you already have `vercel.json` configured, you can deploy both frontend and backend on Vercel.

### Step 1: Prepare for Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`

### Step 2: Environment Variables
Create `.env.local` in your root directory:
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
```

### Step 3: Deploy
```bash
# Deploy to Vercel
vercel

# For production
vercel --prod
```

### Step 4: Configure in Vercel Dashboard
1. Go to your project in Vercel dashboard
2. Settings → Environment Variables
3. Add all required environment variables

### Step 5: Update CORS for Vercel
Your `vercel.json` already handles routing, but update CORS in `api/index.ts`:
```typescript
app.use(cors({
  origin: [
    'https://your-project.vercel.app',
    'http://localhost:5173', 
    'http://localhost:3000'
  ],
  credentials: true
}));
```

## Vercel Configuration (Already Set)
Your `vercel.json` is already configured to:
- Handle API routes via `/api/*`
- Serve frontend for all other routes
- Set max duration to 30 seconds

## Pros of Vercel Deployment:
- ✅ Single deployment
- ✅ Automatic HTTPS
- ✅ Built-in CI/CD
- ✅ Easy environment management
- ✅ Serverless functions

## Cons:
- ⚠️ Serverless limitations (30s timeout)
- ⚠️ Cold starts
- ⚠️ File upload limitations
