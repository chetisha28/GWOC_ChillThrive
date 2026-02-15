const mongoose = require("mongoose");

const bookingDetail = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    customer_name: {
        type: String,
        required: true,
    },
    customer_email: {
        type: String,
        required: true
    },
    customer_phone: {
        type: Number,
        required: true 
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Services'
    },
    combo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Combo'
    },
    
    bookingDate: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["booked", "confirmed", "cancelled"],
        default: "booked"
    },
    
    booking_date: {
        type: Date,
        required: true
    },
    booking_time: {
        startTime: String,
        endTime: String
    },
    booking_id: {
        type: String,
        required: true,
        unique: true
    },
    duration: {
        type: Number,
        required: true
    },
    service_type: { 
        type: String,
        enum: ["services", "combo"],
        required: true
    },
    payment_method: {
        type: String,
        enum: ["online", "cash"],
        required: true
    },
    payment_status: {
        type: String,
        enum: ["pending", "successfully paid", "failed"],
        required: true
    },
    booking_status: {
        type: String,
        enum: ["confirmed", "cancelled"],
        required: true
    },
    price: { 
        type: Number,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model("Booking", bookingDetail);
