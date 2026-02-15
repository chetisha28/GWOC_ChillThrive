const Booking = require("../models/booking.model");
const Service = require("../models/service.model");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

const generateBookingId = () => {
    return `BK${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
};

const createBooking = async (userId, serviceId, bookingDate, timeSlot, customerDetails) => {
    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
        throw new ApiError(400, "Service not available");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const existingBooking = await Booking.findOne({
        service: serviceId,
        bookingDate: new Date(bookingDate),
        timeSlot: timeSlot,
        status: "booked",
    });

    if (existingBooking) {
        throw new ApiError(409, "Slot already booked");
    }

    const bookingData = {
        user: userId,
        service: serviceId,
        bookingDate: new Date(bookingDate),
        timeSlot: timeSlot,
        status: "booked",
        
        // Customer details
        customer_name: customerDetails?.name || user.name,
        customer_email: customerDetails?.email || user.email,
        customer_phone: customerDetails?.phone || 0,
        
        // Additional required fields
        booking_date: new Date(bookingDate),
        booking_time: {
            startTime: timeSlot.split('-')[0] || timeSlot,
            endTime: timeSlot.split('-')[1] || timeSlot
        },
        booking_id: generateBookingId(),
        duration: 30, // Default 30 minutes
        service_type: "services",
        payment_method: "online",
        payment_status: "pending",
        booking_status: "confirmed",
        price: parseInt(service.price) || 0
    };

    const booking = await Booking.create(bookingData);
    return await Booking.findById(booking._id).populate('service');
};

const getUserBookings = async (userId) => {
    return await Booking.find({ user: userId })
        .populate("service")
        .sort({ createdAt: -1 });
};

const cancelBooking = async (bookingId, userId) => {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.user.toString() !== userId.toString()) {
        throw new ApiError(403, "Not authorized to cancel this booking");
    }

    booking.status = "cancelled";
    booking.booking_status = "cancelled";
    await booking.save();

    return booking;
};

module.exports = {
    createBooking,
    getUserBookings,
    cancelBooking,
};
