require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        const adminEmail = 'admin@flowsystem.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            existingAdmin.role = 'Admin';
            await existingAdmin.save();
            console.log('✅ Existing user promoted to Admin:', adminEmail);
        } else {
            const admin = new User({
                name: 'System Admin',
                email: adminEmail,
                password: 'adminpassword123',
                role: 'Admin',
                isEmailVerified: true
            });
            await admin.save();
            console.log('✅ New Admin user created:');
            console.log('   Email: admin@flowsystem.com');
            console.log('   Password: adminpassword123');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
