const nodemailer = require('nodemailer');

const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use SSL
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false // Helps in development environments
        }
    });
};

const sendOTPEmail = async (email, otp) => {
    try {
        console.log(`[EMAIL] Attempting to send OTP to: ${email}`);
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Binjwa Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Registration OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #333; text-align: center;">Welcome to Binjwa</h2>
                    <p style="font-size: 16px; color: #555;">Hello,</p>
                    <p style="font-size: 16px; color: #555;">Thank you for registering. Please use the following One-Time Password (OTP) to complete your account setup:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 5px; padding: 10px 20px; background: #f3f4f6; border-radius: 5px;">${otp}</span>
                    </div>
                    <p style="font-size: 14px; color: #777;">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #999; text-align: center;">© ${new Date().getFullYear()} Binjwa. All rights reserved.</p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL] OTP sent successfully to ${email}. Message ID: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('[EMAIL ERROR] Failed to send OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
};

const sendPasswordResetEmail = async (email, resetUrl) => {
    try {
        console.log(`[EMAIL] Attempting to send Password Reset link to: ${email}`);
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Binjwa Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #333; text-align: center;">Password Reset</h2>
                    <p style="font-size: 16px; color: #555;">Hello,</p>
                    <p style="font-size: 16px; color: #555;">You requested to reset your password. Please click the button below to set a new password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Reset Password</a>
                    </div>
                    <p style="font-size: 14px; color: #777;">Or copy and paste this link in your browser:</p>
                    <p style="font-size: 14px; color: #2563eb; word-break: break-all;">${resetUrl}</p>
                    <p style="font-size: 14px; color: #777;">This link is valid for 15 minutes. If you did not request a password reset, please ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #999; text-align: center;">© ${new Date().getFullYear()} Binjwa. All rights reserved.</p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL] Password reset email sent successfully to ${email}. Message ID: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('[EMAIL ERROR] Failed to send password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};

module.exports = { sendOTPEmail, sendPasswordResetEmail };

