const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Listing = require('./src/models/Listing');
const User = require('./src/models/User'); // Assuming User model is needed for owner reference

dotenv.config({ path: './.env' }); // Load environment variables from .env

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const seedListings = async () => {
  await connectDB();

  try {
    await Listing.deleteMany();
    console.log('Existing listings cleared.');

    // Find an existing user to assign as owner, or create one
    let ownerUser = await User.findOne({ email: 'farmer@example.com' });
    if (!ownerUser) {
      ownerUser = new User({
        name: 'Farmer John',
        email: 'farmer@example.com',
        password: 'password123', // In a real app, hash this password
        role: 'owner',
      });
      await ownerUser.save();
      console.log('Dummy farmer user created.');
    }

    const listings = [
      {
        title: 'John Deere 5075E Tractor',
        description: 'Well-maintained tractor, perfect for small to medium farms. Available for rent daily or weekly.',
        category: 'machine',
        price: 1500,
        priceType: 'per_day',
        images: ['https://images.unsplash.com/photo-1582719503527-c47261611729?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
        location: { district: 'Rural', village: 'Green Valley' },
        availability: { startDate: new Date(), endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)) },
        owner: ownerUser._id,
        isApproved: true,
        featured: true,
        rating: 4.8,
        reviews: 12,
        distance: '5 km',
      },
      {
        title: 'Set of Hand Tools',
        description: 'Various hand tools including shovels, rakes, hoes, and pruning shears. Ideal for garden work.',
        category: 'tool',
        price: 50,
        priceType: 'per_day',
        images: ['https://images.unsplash.com/photo-1532622785990-d2c3613f1350?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
        location: { district: 'Central', village: 'Farmville' },
        availability: { startDate: new Date(), endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)) },
        owner: ownerUser._id,
        isApproved: true,
        rating: 4.5,
        reviews: 8,
        distance: '10 km',
      },
      {
        title: '2 Acre Farmland Plot',
        description: 'Fertile land available for seasonal cultivation. Water access and good sunlight.',
        category: 'land',
        price: 10000,
        priceType: 'per_day',
        images: ['https://images.unsplash.com/photo-1500382017468-9049cea7614f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
        location: { district: 'East', village: 'Sunnyside' },
        availability: { startDate: new Date(), endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)) },
        owner: ownerUser._id,
        isApproved: true,
        featured: true,
        rating: 4.9,
        reviews: 20,
        distance: '15 km',
      },
      {
        title: 'Kubota Mini Excavator',
        description: 'Compact excavator for digging and trenching. Easy to operate.',
        category: 'machine',
        price: 2000,
        priceType: 'per_day',
        images: ['https://images.unsplash.com/photo-1596199050212-11774b6817d2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
        location: { district: 'West', village: 'Riverside' },
        availability: { startDate: new Date(), endDate: new Date(new Date().setMonth(new Date().getMonth() + 2)) },
        owner: ownerUser._id,
        isApproved: true,
        rating: 4.7,
        reviews: 9,
        distance: '8 km',
      },
      {
        title: 'Irrigation Pump System',
        description: 'High-capacity irrigation pump, suitable for large fields.',
        category: 'tool',
        price: 300,
        priceType: 'per_day',
        images: ['https://images.unsplash.com/photo-1627916607761-3090176c597e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
        location: { district: 'North', village: 'Waterbrook' },
        availability: { startDate: new Date(), endDate: new Date(new Date().setMonth(new Date().getMonth() + 4)) },
        owner: ownerUser._id,
        isApproved: true,
        rating: 4.6,
        reviews: 6,
        distance: '12 km',
      },
    ];

    await Listing.insertMany(listings);
    console.log('Listings seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding listings:', error);
    process.exit(1);
  }
};

seedListings();
