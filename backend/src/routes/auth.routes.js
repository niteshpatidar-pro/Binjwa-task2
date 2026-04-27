const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, login, refreshToken, logout, sendOTP, verifyOTP, googleCallback, sendRegistrationOTP } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/auth/register-otp:
 *   post:
 *     summary: Send OTP for registration
 *     tags: [Auth]
 */
router.post('/register-otp', sendRegistrationOTP);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user (Final step after OTP)
 *     tags: [Auth]
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 */
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/otp/send', sendOTP);
router.post('/otp/verify', verifyOTP);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` }),
    googleCallback
);

module.exports = router;
