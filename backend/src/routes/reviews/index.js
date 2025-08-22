const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const reviewController = require('../../controllers/reviews');

// @route   POST api/reviews
// @desc    Create a review
// @access  Private
router.post('/', auth, reviewController.createReview);

// @route   GET api/reviews/:listingId
// @desc    Get all reviews for a listing
// @access  Public
router.get('/:listingId', reviewController.getReviews);

module.exports = router;
