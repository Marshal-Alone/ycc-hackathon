const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const authController = require('../../controllers/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);

module.exports = router;
