const express = require('express');
const router = express.Router();

const adminController = require('../../controllers/admin');

router.post('/login', adminController.login);

// User management routes
router.get('/recent-users', adminController.getRecentUsers);
router.get('/users', adminController.getUsers);
router.put('/users/:id/block', adminController.blockUser);
router.put('/users/:id/unblock', adminController.unblockUser);

// Listing management routes
router.get('/listings', adminController.getListings);
router.put('/listings/:id/approve', adminController.approveListing);
router.delete('/listings/:id', adminController.removeListing);

// Booking and payment management routes
router.get('/bookings', adminController.getBookings);
router.get('/payments', adminController.getPayments);

// System control routes
router.put('/users/:id/mark-suspicious', adminController.markUserSuspicious);
router.put('/listings/:id/mark-suspicious', adminController.markListingSuspicious);

// Analytics routes
router.get('/analytics', adminController.getAnalytics);

module.exports = router;
