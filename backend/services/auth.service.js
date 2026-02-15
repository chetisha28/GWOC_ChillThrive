const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // ADD THIS
const User = require('../models/user.model');

exports.registerUser = async (name, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    return { user, token };
}

exports.loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        return { success: false, message: 'Invalid credentials'};
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return { success: false, message: 'Invalid credentials'};
    }

    // Generate JWT token
    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    return { success: true, user, token };
}
