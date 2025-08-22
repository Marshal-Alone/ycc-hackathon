const mongoose = require('mongoose');
// Ensure dotenv is configured here as well, in case it's called before index.js fully loads it
require('dotenv').config(); 

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in environment variables.');
    }
    await mongoose.connect(mongoURI, {
      ssl: true,
      tls: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
