const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const bookingController = require('../../controllers/bookings');

// @route   POST api/bookings
// @desc    Create a booking
// @access  Private
router.post('/', auth, bookingController.createBooking);

// @route   GET api/bookings
// @desc    Get all bookings for a user
// @access  Private
router.get('/', auth, bookingController.getBookings);

// @route   PUT api/bookings/:id/approve
// @desc    Approve a booking
// @access  Private
router.put('/:id/approve', auth, bookingController.approveBooking);

// @route   PUT api/bookings/:id/decline
// @desc    Decline a booking
// @access  Private
router.put('/:id/decline', auth, bookingController.declineBooking);

module.exports = router;
