# 🚀 Quick Deploy Cheat Sheet

## One-Time Setup

### 1️⃣ Deploy Backend (Render)
```
1. Go to render.com → New Web Service
2. Connect GitHub (backend folder)
3. Settings:
   - Build: npm install
   - Start: node index.js
4. Add Environment Variables (see below)
5. Deploy!
6. Copy your backend URL (e.g., https://xyz.onrender.com)
```

### 2️⃣ Deploy Frontend (Netlify)
```
1. Create .env.production file:
   VITE_API_URL=https://your-backend-url.onrender.com/api

2. Go to netlify.com → New site from Git
3. Settings:
   - Build command: npm run build
   - Publish directory: build
4. Add Environment Variable:
   VITE_API_URL=https://your-backend-url.onrender.com/api
5. Deploy!
```

---

## Environment Variables

### Backend (Render/Railway)
```env
CLOUDINARY_CLOUD_NAME=ddrqogctl
CLOUDINARY_API_KEY=377973599139459
CLOUDINARY_API_SECRET=tVwMrrfw66RoxgnT7NgfN9wiPU8
MONGO_URI=mongodb+srv://SoulSociery:SoulSociery@ycc-hackathon.pxtlcww.mongodb.net/?retryWrites=true&w=majority&appName=YCC-Hackathon
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=production
```

### Frontend (Netlify)
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

## Local Development Commands

### Frontend
```bash
npm install       # Install dependencies
npm run dev       # Start dev server (port 2000)
npm run build     # Build for production
```

### Backend
```bash
cd backend
npm install       # Install dependencies
npm run dev       # Start dev server with nodemon
npm start         # Start production server
```

---

## Files Created for Deployment

✅ `netlify.toml` - Netlify configuration
✅ `DEPLOYMENT.md` - Full deployment guide
✅ `.env.production.template` - Environment template
✅ `.gitignore` - Git ignore rules
✅ Updated `src/api.js` - Dynamic API URL
✅ Updated `backend/package.json` - Production scripts

---

## Testing Deployment

### Backend Health Check
```bash
curl https://your-backend-url.onrender.com/
# Should return: "Server is running"

curl https://your-backend-url.onrender.com/api/listings
# Should return: listings data or []
```

### Frontend
- Visit your Netlify URL
- Open browser console (F12)
- Check for API connection errors
- Test login/register functionality

---

## Common Issues

**❌ "Network Error" in frontend**
→ Check VITE_API_URL is set correctly
→ Rebuild and redeploy frontend

**❌ Backend is slow to respond**
→ Render free tier sleeps after 15 min
→ First request wakes it up (30-60 sec delay)

**❌ CORS errors**
→ Update CORS settings in backend/index.js:
```javascript
app.use(cors({
  origin: 'https://your-site.netlify.app'
}));
```

**❌ Build fails on Netlify**
→ Check build logs
→ Ensure all dependencies are in package.json
→ Try `npm run build` locally first

---

## Update After Changes

### Frontend Changes
```bash
git add .
git commit -m "Update frontend"
git push origin main
# Netlify auto-deploys!
```

### Backend Changes
```bash
git add .
git commit -m "Update backend"
git push origin main
# Render auto-deploys!
```

---

For detailed instructions, see `DEPLOYMENT.md`
