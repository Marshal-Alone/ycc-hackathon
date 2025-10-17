# Deployment Guide for Farmer-to-Farmer Rental Marketplace

This guide covers deploying the application with the frontend on Netlify and backend on a separate platform.

---

## 🎯 Architecture

- **Frontend**: React + Vite app (Static) → Netlify
- **Backend**: Express.js + MongoDB → Render/Railway/Heroku

---

## 📋 Prerequisites

1. GitHub account (to connect repositories)
2. Netlify account (free tier available)
3. Backend hosting account (Render/Railway recommended - free tier)
4. MongoDB Atlas account (for production database)
5. Cloudinary account (for image uploads)

---

## 🚀 Step-by-Step Deployment

### **Part 1: Deploy Backend First**

#### Option A: Deploy on Render (Recommended - Free Tier)

1. **Push your backend to GitHub**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend commit"
   git remote add origin <your-backend-repo-url>
   git push -u origin main
   ```

2. **Create Web Service on Render**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository (backend only)
   - Configure:
     - **Name**: `farmer-marketplace-api`
     - **Region**: Choose closest to your users
     - **Branch**: `main`
     - **Root Directory**: Leave empty (or specify if backend is in subdirectory)
     - **Build Command**: `npm install`
     - **Start Command**: `node index.js` (not nodemon in production)
     - **Instance Type**: Free

3. **Add Environment Variables on Render**
   In the "Environment" section, add:
   ```
   CLOUDINARY_CLOUD_NAME=ddrqogctl
   CLOUDINARY_API_KEY=377973599139459
   CLOUDINARY_API_SECRET=tVwMrrfw66RoxgnT7NgfN9wiPU8
   MONGO_URI=mongodb+srv://SoulSociery:SoulSociery@ycc-hackathon.pxtlcww.mongodb.net/?retryWrites=true&w=majority&appName=YCC-Hackathon
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   PORT=5000
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL (e.g., `https://farmer-marketplace-api.onrender.com`)

#### Option B: Deploy on Railway

1. **Push backend to GitHub** (same as above)

2. **Create Project on Railway**
   - Go to https://railway.app
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your backend repository
   - Configure:
     - **Start Command**: `node index.js`

3. **Add Environment Variables**
   (Same as Render above)

4. **Generate Domain**
   - Go to Settings → Generate Domain
   - Note your backend URL

---

### **Part 2: Deploy Frontend on Netlify**

1. **Update Environment Variable for Backend URL**
   
   Create a `.env.production` file in the root directory:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

   Replace `your-backend-url.onrender.com` with your actual backend URL from Part 1.

2. **Push Frontend to GitHub**
   ```bash
   git add .
   git commit -m "Configure for production deployment"
   git push origin main
   ```

3. **Deploy on Netlify**
   
   **Method 1: Via Netlify Dashboard (Easier)**
   - Go to https://netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository
   - Configure build settings:
     - **Branch**: `main`
     - **Build command**: `npm run build`
     - **Publish directory**: `build`
     - **Build environment variables**:
       - Add `VITE_API_URL` with your backend URL
   - Click "Deploy site"

   **Method 2: Via Netlify CLI**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Login to Netlify
   netlify login

   # Initialize and deploy
   netlify init

   # Follow the prompts:
   # - Create & configure a new site
   # - Build command: npm run build
   # - Publish directory: build
   
   # Deploy
   netlify deploy --prod
   ```

4. **Configure Environment Variables on Netlify**
   - Go to Site settings → Build & deploy → Environment
   - Add variable:
     - **Key**: `VITE_API_URL`
     - **Value**: `https://your-backend-url.onrender.com/api`
   - Redeploy the site

5. **Configure Custom Domain (Optional)**
   - Go to Domain settings
   - Add your custom domain
   - Update DNS records as instructed

---

## 🔧 Configuration Files Created

### `netlify.toml`
This file configures:
- Build command and output directory
- SPA routing (redirects all routes to index.html)
- Security headers
- Asset caching

### Updated `src/api.js`
- Now uses environment variable `VITE_API_URL`
- Falls back to localhost for development

---

## ✅ Post-Deployment Checklist

### Backend
- [ ] Server is running and accessible
- [ ] MongoDB connection is working
- [ ] All environment variables are set
- [ ] API endpoints return expected responses
- [ ] CORS is configured to allow frontend domain
- [ ] Test key endpoints:
  - `GET https://your-backend-url.com/` (should return "Server is running")
  - `GET https://your-backend-url.com/api/listings`

### Frontend
- [ ] Site builds successfully
- [ ] All pages load correctly
- [ ] API calls work (check browser console)
- [ ] Authentication flow works
- [ ] Image uploads work (Cloudinary integration)
- [ ] No console errors

---

## 🔒 Security Recommendations

1. **Change JWT Secret**
   ```
   JWT_SECRET=use_a_long_random_string_here_at_least_32_characters
   ```

2. **Update CORS Settings**
   In `backend/index.js`, update CORS to only allow your frontend:
   ```javascript
   app.use(cors({
     origin: 'https://your-netlify-site.netlify.app',
     credentials: true
   }));
   ```

3. **Use Environment Variables**
   - Never commit `.env` files
   - Use platform-specific environment variable settings

4. **MongoDB Security**
   - Use strong passwords
   - Limit IP whitelist in MongoDB Atlas
   - Use separate databases for dev/prod

---

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_URL` environment variable is set correctly
- Verify CORS settings on backend
- Check browser console for errors
- Verify backend is running and accessible

### Build fails on Netlify
- Check Node version compatibility
- Ensure all dependencies are in `package.json`
- Check build logs for specific errors
- Try building locally first: `npm run build`

### Backend deployment fails
- Check start command is `node index.js` (not nodemon)
- Verify all environment variables are set
- Check MongoDB connection string
- Review deployment logs

---

## 📝 Quick Command Reference

### Development (Local)
```bash
# Frontend (from root directory)
npm install
npm run dev

# Backend (from backend directory)
cd backend
npm install
npm start
```

### Production Build Test (Local)
```bash
# Test frontend production build locally
npm run build
npx serve build

# Set backend URL for testing
# Create .env.local file with:
# VITE_API_URL=https://your-backend-url.com/api
```

### Deployment
```bash
# Deploy to Netlify (after configuration)
netlify deploy --prod

# Or just push to GitHub (if auto-deploy is configured)
git push origin main
```

---

## 🌐 Expected URLs After Deployment

- **Frontend**: `https://your-site-name.netlify.app`
- **Backend** (Render): `https://farmer-marketplace-api.onrender.com`
- **Backend** (Railway): `https://farmer-marketplace-api.up.railway.app`

---

## 📚 Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

---

## ⚠️ Important Notes

1. **Free Tier Limitations**:
   - Render free tier: Apps sleep after 15 min of inactivity (first request may be slow)
   - Netlify free tier: 100GB bandwidth/month, 300 build minutes/month
   - Railway free tier: $5 credit/month

2. **Backend Alternative**: If you want everything on Netlify, you'll need to refactor the Express backend into Netlify Functions (significant work).

3. **Database**: Make sure to use MongoDB Atlas (cloud) not local MongoDB for production.

4. **Environment Variables**: The frontend build embeds environment variables at build time, so you need to rebuild/redeploy if you change `VITE_API_URL`.

---

Good luck with your deployment! 🚀
