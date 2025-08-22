const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/config/db');

connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// no need to serve /uploads because we use Cloudinary

// Cloudinary environment variable check
["CLOUDINARY_CLOUD_NAME","CLOUDINARY_API_KEY","CLOUDINARY_API_SECRET"]
  .forEach(k => { if (!process.env[k]) { console.error(`Missing ${k}`); }});

const adminRoutes = require('./src/routes/admin');
const authRoutes = require('./src/routes/auth');

app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

const listingRoutes = require('./src/routes/listings');
app.use('/api/listings', listingRoutes);

const bookingRoutes = require('./src/routes/bookings');
app.use('/api/bookings', bookingRoutes);

const reviewRoutes = require('./src/routes/reviews');
app.use('/api/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

// Multer error handler
app.use((err, _req, res, _next) => {
  if (err instanceof require('multer').MulterError) {
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
