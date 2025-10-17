# HireNow Deployment Guide 🚀

## Prerequisites
- MongoDB Atlas account (free tier)
- GitHub repository with your code
- Render.com account
- Netlify account

## Step 1: Backend Deployment (Render)

### 1.1 Setup MongoDB Atlas
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Create a database user
4. Whitelist all IPs (0.0.0.0/0) for development
5. Get your connection string

### 1.2 Deploy to Render
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: `20`

### 1.3 Environment Variables (Render)
Add these in Render dashboard:
```
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hirenow?retryWrites=true&w=majority
JWT_SECRET=your_strong_jwt_secret_here
PORT=10000
```

## Step 2: Frontend Deployment (Netlify)

### 2.1 Prepare Frontend
1. Update `client/src/config.ts` with your Render backend URL:
```typescript
export const config = {
  API_BASE_URL: 'https://your-backend.onrender.com',
};
```

### 2.2 Deploy to Netlify
1. Go to [Netlify.com](https://app.netlify.com)
2. Sign up with GitHub
3. Click "New site from Git"
4. Choose your repository
5. Configure:
   - **Base Directory**: `client`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

### 2.3 Environment Variables (Netlify)
Add these in Netlify dashboard:
```
VITE_API_URL=https://your-backend.onrender.com
```

## Step 3: Update CORS Configuration

Update `api/index.ts` CORS origins with your actual Netlify URL:
```typescript
app.use(cors({
  origin: [
    'https://your-app.netlify.app', // Your actual Netlify URL
    'http://localhost:5173', 
    'http://localhost:3000'
  ],
  credentials: true
}));
```

## Step 4: Test Deployment

1. Visit your Netlify URL
2. Test login/registration
3. Test job creation and applications
4. Check browser console for errors

## Troubleshooting

### Common Issues:
1. **CORS errors**: Update CORS origins with exact URLs
2. **MongoDB connection**: Check connection string and IP whitelist
3. **Build failures**: Check Node version compatibility
4. **Environment variables**: Ensure all required vars are set

### Useful Commands:
```bash
# Test backend locally
cd server
npm run dev

# Test frontend locally
cd client
npm run dev

# Check build
npm run build
```

## URLs After Deployment
- **Frontend**: https://your-app.netlify.app
- **Backend**: https://your-backend.onrender.com
- **API Health**: https://your-backend.onrender.com/api/health
