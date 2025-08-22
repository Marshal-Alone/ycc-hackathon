const Booking = require('../../models/Booking');
const Listing = require('../../models/Listing');

exports.createBooking = async (req, res) => {
  const { listingId, startDate, endDate, totalPrice } = req.body;

  try {
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }

    const newBooking = new Booking({
      listing: listingId,
      renter: req.user.id,
      owner: listing.owner,
      startDate,
      endDate,
      totalPrice,
    });

    const booking = await newBooking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ renter: req.user.id }).populate('listing', ['title']);
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Check user
    if (booking.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    booking.status = 'confirmed';
    await booking.save();

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.declineBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Check user
    if (booking.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
