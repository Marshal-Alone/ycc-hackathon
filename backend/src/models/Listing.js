const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
});

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['machine', 'tool', 'land'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    priceType: {
      type: String,
      enum: ['per_day', 'per_hour'],
      required: true,
    },
    images: [ImageSchema],
    location: {
      district: String,
      village: String,
    },
    availability: {
      startDate: {
        type: Date,
        required: false, // Make startDate optional
      },
      endDate: {
        type: Date,
        required: false, // Make endDate optional
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isSuspicious: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Listing', listingSchema);
