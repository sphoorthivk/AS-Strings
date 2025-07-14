# Deployment Guide

This guide will help you deploy the AS Shreads e-commerce application to Render (backend) and Vercel (frontend).

## Prerequisites

1. GitHub account
2. Render account (https://render.com)
3. Vercel account (https://vercel.com)
4. MongoDB Atlas account (https://cloud.mongodb.com)

## Step 1: Prepare Your Repository

1. Push your code to a GitHub repository
2. Make sure all files are committed and pushed

## Step 2: Set Up MongoDB Atlas

1. Create a MongoDB Atlas account
2. Create a new cluster (free tier is fine)
3. Create a database user
4. Get your connection string
5. Whitelist all IP addresses (0.0.0.0/0) for Render

## Step 3: Deploy Backend to Render

### Option A: Using render.yaml (Recommended)

1. Go to https://render.com/dashboard
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Set the following environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string (32+ characters)
   - `CLOUDINARY_CLOUD_NAME`: (Optional) Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: (Optional) Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: (Optional) Your Cloudinary API secret

### Option B: Manual Setup

1. Go to https://render.com/dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: as-shreads-backend
   - **Environment**: Node
   - **Region**: Choose closest to your users
   - **Branch**: main
   - **Root Directory**: server
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add environment variables (same as above)
6. Click "Create Web Service"

## Step 4: Deploy Frontend to Vercel

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
5. Add environment variable:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://as-shreads-backend.onrender.com/api`)
6. Click "Deploy"

## Step 5: Configure CORS

After deployment, update your backend CORS configuration to allow your Vercel domain:

```javascript
// In server/server.js
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://your-vercel-app.vercel.app' // Add your Vercel URL
  ],
  credentials: true
}));
```

## Step 6: Seed Database (Optional)

1. In your Render dashboard, go to your web service
2. Open the "Shell" tab
3. Run: `npm run seed`

## Step 7: Test Your Deployment

1. Visit your Vercel URL
2. Test user registration and login
3. Test product browsing and cart functionality
4. Test order placement

## Environment Variables Summary

### Frontend (Vercel)
- `VITE_API_URL`: Backend API URL from Render

### Backend (Render)
- `NODE_ENV`: production
- `PORT`: 10000 (automatically set by Render)
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secure random string
- `CLOUDINARY_CLOUD_NAME`: (Optional) Cloudinary cloud name
- `CLOUDINARY_API_KEY`: (Optional) Cloudinary API key
- `CLOUDINARY_API_SECRET`: (Optional) Cloudinary API secret

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your Vercel URL is added to CORS origins
2. **Database Connection**: Verify MongoDB URI and IP whitelist
3. **Environment Variables**: Double-check all required variables are set
4. **Build Failures**: Check build logs for missing dependencies

### Logs:
- **Render**: Check logs in your service dashboard
- **Vercel**: Check function logs and build logs in dashboard

## Custom Domain (Optional)

### Vercel:
1. Go to your project settings
2. Add your custom domain
3. Configure DNS records

### Render:
1. Go to your service settings
2. Add custom domain
3. Configure DNS records

## Monitoring

- Set up monitoring in both Render and Vercel dashboards
- Configure alerts for downtime
- Monitor database usage in MongoDB Atlas

## Security Considerations

1. Use strong JWT secrets
2. Enable MongoDB IP whitelisting in production
3. Use HTTPS only
4. Regularly update dependencies
5. Monitor for security vulnerabilities

## Scaling

- **Render**: Upgrade to paid plans for better performance
- **Vercel**: Automatic scaling included
- **MongoDB**: Monitor usage and upgrade cluster if needed

For support, check the documentation:
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)