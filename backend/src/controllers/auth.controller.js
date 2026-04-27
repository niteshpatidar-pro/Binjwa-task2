const User = require('../models/User');
const OTP = require('../models/OTP');
const { generateAccessToken, generateRefreshToken } = require('../utils/token.utils');
const { sendOTPEmail } = require('../utils/email.utils');
const jwt = require('jsonwebtoken');

exports.sendRegistrationOTP = async (req, res) => {
    try {
        const { email } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save OTP to database
        await OTP.findOneAndUpdate(
            { email },
            { otp, createdAt: new Date() },
            { upsert: true, new: true }
        );

        // Send OTP via Email
        await sendOTPEmail(email, otp);

        res.json({
            success: true,
            message: 'OTP sent to your email address'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, mobile, otp } = req.body;
        
        // 1. Verify OTP
        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord) {
            return res.status(400).json({ success: false, message: 'OTP expired. Please register again' });
        }

        if (otpRecord.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again' });
        }

        // 2. Check if user already exists (extra safety)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // 3. Create user
        const user = new User({ 
            name, 
            email, 
            password, 
            mobile,
            isEmailVerified: true 
        });
        await user.save();

        // 4. Delete OTP after use
        await OTP.deleteOne({ email });

        res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshTokens.push(refreshToken);
        user.lastLogin = new Date();
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            success: true,
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                kycStatus: user.kycStatus
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || !user.refreshTokens.includes(refreshToken)) {
            return res.sendStatus(403);
        }

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        // Rotate tokens
        user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
        user.refreshTokens.push(newRefreshToken);
        await user.save();

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.sendStatus(403);
    }
};

exports.logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        const user = await User.findOne({ refreshTokens: refreshToken });
        if (user) {
            user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
            await user.save();
        }
    }
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully' });
};

exports.sendOTP = async (req, res) => {
    try {
        const { mobile } = req.body;
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        await User.findOneAndUpdate(
            { mobile },
            { otp: { code, expiresAt } },
            { upsert: true }
        );

        // Mock sending SMS
        console.log(`[MOCK SMS] OTP for ${mobile}: ${code}`);
        
        res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { mobile, code } = req.body;
        const user = await User.findOne({ mobile });

        if (!user || user.otp.code !== code || user.otp.expiresAt < new Date()) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        user.isMobileVerified = true;
        user.otp = undefined;
        await user.save();

        res.json({ success: true, message: 'Mobile verified successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.googleCallback = async (req, res) => {
    try {
        const accessToken = generateAccessToken(req.user);
        const refreshToken = generateRefreshToken(req.user);

        req.user.refreshTokens.push(refreshToken);
        req.user.lastLogin = new Date();
        await req.user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Encode user data for the frontend to populate AuthContext
        const userData = encodeURIComponent(JSON.stringify({
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            kycStatus: req.user.kycStatus
        }));

        // Redirect to /auth/callback which will store token + user and go to dashboard
        const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${accessToken}&user=${userData}`;
        console.log('Redirecting to frontend:', redirectUrl);
        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Google OAuth Callback Error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=OAuthFailed`);
    }
};
