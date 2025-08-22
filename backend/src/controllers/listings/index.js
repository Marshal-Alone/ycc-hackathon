const Listing = require('../../models/Listing');
const cloudinary = require('../../config/cloudinary'); // Import cloudinary for image deletion

exports.getListings = async (req, res) => {
  try {
    const listings = await Listing.find().populate('owner', ['name']);
    res.json(listings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user.id }).populate('owner', ['name']);
    res.json(listings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.searchListings = async (req, res) => {
  const { category, district, village, startDate, endDate } = req.query;

  try {
    let query = {};

    if (category) {
      query.category = category;
    }

    if (district) {
      query['location.district'] = district;
    }

    if (village) {
      query['location.village'] = village;
    }

    if (startDate && endDate) {
      query['availability.startDate'] = { $lte: new Date(endDate) };
      query['availability.endDate'] = { $gte: new Date(startDate) };
    }

    const listings = await Listing.find(query).populate('owner', ['name']);
    res.json(listings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('owner', ['name']);

    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }

    res.json(listing);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Listing not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.updateListing = async (req, res) => {
  const {
    title,
    description,
    category,
    price,
    priceType,
    location: locationString, // Rename to avoid conflict with parsed object
    availability: availabilityString, // Rename to avoid conflict with parsed object
  } = req.body;

  let existingImages = [];
  // req.body.existingImages will be an array of objects, but each object's properties will be stringified
  // We need to parse them
  if (req.body.existingImages) {
    if (Array.isArray(req.body.existingImages)) {
      existingImages = req.body.existingImages.map(img => {
        if (typeof img === 'string') {
          try {
            return JSON.parse(img);
          } catch (e) {
            console.error("Error parsing existing image string:", img, e);
            return null;
          }
        }
        return img;
      }).filter(Boolean); // Filter out any nulls from parsing errors
    } else if (typeof req.body.existingImages === 'string') {
      // If only one existing image is sent, it might not be an array
      try {
        existingImages = [JSON.parse(req.body.existingImages)];
      } catch (e) {
        console.error("Error parsing single existing image string:", req.body.existingImages, e);
      }
    }
  }

  const newImages = (req.files && req.files.newImages ? req.files.newImages : []).map(f => ({
    url: f.path,
    publicId: f.filename,
  }));

  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }

    // Check user
    if (listing.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Identify images to delete from Cloudinary
    const currentImagePublicIds = new Set(listing.images.map(img => img.publicId));
    const imagesToKeepPublicIds = new Set(existingImages.map(img => img.publicId));

    const imagesToDelete = listing.images.filter(img => !imagesToKeepPublicIds.has(img.publicId));

    const deleteJobs = imagesToDelete.map(async (img) => {
      if (img.publicId) {
        try {
          await cloudinary.uploader.destroy(img.publicId);
        } catch (e) {
          console.error("CLOUDINARY DESTROY FAIL (updateListing):", img.publicId, e?.message);
        }
      }
    });
    await Promise.all(deleteJobs);

    const updatedImages = [...existingImages, ...newImages];

    const listingFields = {
      title,
      description,
      category,
      price: parseFloat(price),
      priceType,
      images: updatedImages,
      location: locationString ? JSON.parse(locationString) : listing.location,
      availability: availabilityString ? JSON.parse(availabilityString) : listing.availability,
    };

    listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: listingFields },
      { new: true }
    );

    res.json(listing);
  } catch (err) {
    console.error("UPDATE LISTING ERROR:", err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Listing not found' });
    }
    res.status(500).json({ message: "Listing update failed", error: err.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }

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
    res.json({ message: "Listing removed" });
  } catch (e) {
    console.error("DELETE ERROR:", e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
};
