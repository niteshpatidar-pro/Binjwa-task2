const nodemailer = require('nodemailer');

const sendOTPEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

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

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send OTP email');
    }
};

module.exports = { sendOTPEmail };
