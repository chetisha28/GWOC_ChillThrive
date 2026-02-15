const mongoose = require('mongoose');

// Function to connect to the database
const connectDB = async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/chillthrive")
    console.log('Database connected');
}

module.exports = connectDB;