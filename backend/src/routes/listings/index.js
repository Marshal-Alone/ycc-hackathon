const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const { upload } = require('../../config/multerCloudinary'); // Import the configured multerCloudinary upload middleware
const Listing = require('../../models/Listing'); // Import the Listing model
const cloudinary = require('../../config/cloudinary'); // Import cloudinary for image deletion
const listingController = require('../../controllers/listings'); // Keep other controller functions

// @route   POST api/listings
// @desc    Create a listing with image upload
// @access  Private
router.post('/', auth, upload.array('newImages', 5), async (req, res) => {
  try {
    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({ message: "No image(s) provided" });
    }

    const images = files.map(f => ({
      url: f.path,       // secure_url
      publicId: f.filename, // public_id
    }));

    const { title, description, category, price, priceType, location, availability } = req.body;

    const listing = await Listing.create({
      title,
      description,
      category,
      price,
      priceType,
      images,
      location: JSON.parse(location), // Assuming location comes as a JSON string from frontend
      availability: JSON.parse(availability), // Assuming availability comes as a JSON string from frontend
      owner: req.user.id,
    });

    res.status(201).json(listing);
  } catch (err) {
    console.error("CREATE LISTING ERROR:", err);
    res.status(500).json({ message: "Image upload or save failed", error: err.message });
  }
});

// @route   GET api/listings
// @desc    Get all listings
// @access  Public
router.get('/', listingController.getListings);

// @route   GET api/listings/my
// @desc    Get all listings for the current user
// @access  Private
router.get('/my', auth, listingController.getMyListings);

// @route   GET api/listings/search
// @desc    Search and filter listings
// @access  Public
router.get('/search', listingController.searchListings);

// @route   GET api/listings/:id
// @desc    Get a single listing
// @access  Public
router.get('/:id', listingController.getListing);

// @route   PUT api/listings/:id
// @desc    Update a listing
// @access  Private
router.put('/:id', auth, upload.fields([
  { name: 'newImages', maxCount: 5 },
  { name: 'existingImages', maxCount: 100 }
]), listingController.updateListing);

// @route   DELETE api/listings/:id
// @desc    Delete a listing with Cloudinary cleanup
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    // Check user
    if (listing.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // delete images from cloudinary
    const jobs = (listing.images || []).map(async (img) => {
      if (img.publicId) {
        try {
          await cloudinary.uploader.destroy(img.publicId);
        } catch (e) {
          console.error("CLOUDINARY DESTROY FAIL:", img.publicId, e?.message);
        }
      } else {
        console.warn("CLOUDINARY DESTROY WARNING: Missing publicId for image", img);
      }
    });
    await Promise.all(jobs);

    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: "Listing deleted" });
  } catch (e) {
    console.error("DELETE ERROR:", e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

module.exports = router;
