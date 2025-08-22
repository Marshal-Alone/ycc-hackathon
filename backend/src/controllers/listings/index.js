const Listing = require('../../models/Listing');

exports.createListing = async (req, res) => {
  const {
    title,
    description,
    category,
    price,
    priceType,
    images,
    location,
    availability,
  } = req.body;

  try {
    const newListing = new Listing({
      title,
      description,
      category,
      price,
      priceType,
      images,
      location,
      availability,
      owner: req.user.id,
    });

    const listing = await newListing.save();
    res.json(listing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

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
    images,
    location,
    availability,
  } = req.body;

  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }

    // Check user
    if (listing.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, category, price, priceType, images, location, availability } },
      { new: true }
    );

    res.json(listing);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Listing not found' });
    }
    res.status(500).send('Server error');
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

    await listing.remove();

    res.json({ msg: 'Listing removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Listing not found' });
    }
    res.status(500).send('Server error');
  }
};
