# Backend Deployment Guide

## Overview
This is the Express.js backend API for the Farmer-to-Farmer Rental Marketplace.

## Tech Stack
- **Framework**: Express.js 5.x
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Cloudinary
- **CORS**: Enabled for cross-origin requests

## Environment Variables Required

```env
# Cloudinary Configuration (Image Upload Service)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# MongoDB Connection
MONGO_URI=your_mongodb_connection_string

# JWT Authentication
JWT_SECRET=your_secret_key_minimum_32_characters

# Server Configuration
PORT=5000
NODE_ENV=production
```

## Local Development

```bash
# Install dependencies
npm install

# Run in development mode (with auto-restart)
npm run dev

# Run in production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Listings
- `GET /api/listings` - Get all listings
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create listing (authenticated)
- `PUT /api/listings/:id` - Update listing (authenticated)
- `DELETE /api/listings/:id` - Delete listing (authenticated)

### Bookings
- `GET /api/bookings` - Get user's bookings (authenticated)
- `POST /api/bookings` - Create booking (authenticated)
- `PUT /api/bookings/:id` - Update booking (authenticated)
- `DELETE /api/bookings/:id` - Cancel booking (authenticated)

### Reviews
- `GET /api/reviews/:listingId` - Get reviews for listing
- `POST /api/reviews` - Create review (authenticated)

### Admin
- `GET /api/admin/*` - Admin endpoints (authenticated, admin only)

## Deployment Platforms

### Recommended: Render.com
1. Create new Web Service
2. Connect GitHub repository
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Environment Variables**: Add all required vars
4. Deploy

### Alternative: Railway.app
1. Create new project from GitHub
2. Add environment variables
3. Generate domain
4. Deploy

### Alternative: Heroku
```bash
heroku create your-app-name
heroku config:set MONGO_URI=your_uri
heroku config:set JWT_SECRET=your_secret
# ... add other env vars
git push heroku main
```

## Production Checklist

- [ ] Update `JWT_SECRET` to a strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas (cloud database)
- [ ] Configure CORS to only allow your frontend domain
- [ ] Verify all environment variables are set
- [ ] Test all API endpoints
- [ ] Monitor error logs

## CORS Configuration

For production, update `index.js`:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-frontend.netlify.app',
  credentials: true
}));
```

## Database

### MongoDB Atlas Setup
1. Create cluster at mongodb.com/atlas
2. Create database user
3. Whitelist IP addresses (0.0.0.0/0 for cloud deployments)
4. Get connection string
5. Add to `MONGO_URI` environment variable

## Security Notes

- Never commit `.env` file
- Use strong JWT secret (32+ characters)
- Enable MongoDB authentication
- Keep dependencies updated
- Use HTTPS in production
- Implement rate limiting for production

## Monitoring

### Health Check Endpoint
```
GET /
Response: "Server is running"
```

### Check Database Connection
Check deployment logs for:
```
MongoDB connected successfully
Server is running on port: 5000
```

## Troubleshooting

**Database connection fails**
- Check MongoDB URI format
- Verify database user credentials
- Check IP whitelist in MongoDB Atlas

**Cloudinary uploads fail**
- Verify API credentials
- Check upload file size limits
- Review Cloudinary usage quota

**CORS errors**
- Update CORS origin to match frontend URL
- Ensure credentials are properly configured

## Performance Tips

- Use connection pooling (already configured in Mongoose)
- Enable compression for responses
- Implement caching for frequently accessed data
- Use indexes on MongoDB collections
- Monitor and optimize slow queries

## Support

For issues, check:
1. Deployment platform logs
2. MongoDB Atlas monitoring
3. Cloudinary dashboard
4. Application logs

---

Last Updated: 2025-10-17
