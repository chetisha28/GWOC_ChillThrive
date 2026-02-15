const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user.model');
require('dotenv').config();

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const adminEmail = 'admin@chillthrive.com';
        const adminPassword = 'admin123'; // Change this to a secure password
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin user already exists');
            mongoose.connection.close();
            return;
        }
        
        // Create admin user
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const admin = await User.create({
            name: 'Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });
        
        console.log('Admin user created successfully:');
        console.log('Email:', adminEmail);
        console.log('Password:', adminPassword);
        console.log('Please change the password after first login');
        
        mongoose.connection.close();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();
