exports.login = (req, res) => {
  // Login logic will be implemented here
  res.send('Admin login');
};

const User = require('../../models/User');
const Listing = require('../../models/Listing');
const Booking = require('../../models/Booking');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.isBlocked = true;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.isBlocked = false;
    await user.save();

    res.json(user);
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

exports.approveListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }

    listing.isApproved = true;
    await listing.save();

    res.json(listing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.removeListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }

    await listing.remove();

    res.json({ msg: 'Listing removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('listing', ['title']).populate('renter', ['name']).populate('owner', ['name']);
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getPayments = async (req, res) => {
  // This is a placeholder for payment reports.
  // In a real application, you would integrate with a payment gateway
  // and fetch payment data from their API.
  res.json({ msg: 'Payment reports are not yet implemented' });
};

exports.markUserSuspicious = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.isSuspicious = true;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.markListingSuspicious = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }

    listing.isSuspicious = true;
    await listing.save();

    res.json(listing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const listings = await Listing.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: 'confirmed' });
    // In a real application, you would calculate total revenue from payments
    const totalRevenue = 0;

    res.json({
      users,
      listings,
      activeBookings,
      totalRevenue,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
