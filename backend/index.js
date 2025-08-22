const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/config/db');

connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
