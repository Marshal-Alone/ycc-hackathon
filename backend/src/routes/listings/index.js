const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const listingController = require('../../controllers/listings');

// @route   POST api/listings/upload
// @desc    Upload listing images
// @access  Private
router.post('/upload', auth, listingController.uploadListingImages);

// @route   POST api/listings
// @desc    Create a listing
// @access  Private
router.post('/', auth, listingController.createListing);

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
router.put('/:id', auth, listingController.updateListing);

// @route   DELETE api/listings/:id
// @desc    Delete a listing
// @access  Private
router.delete('/:id', auth, listingController.deleteListing);

module.exports = router;
