const bookingService = require("../services/booking.service");
const ApiResponse = require("../utils/ApiResponse");
const catchAsync = require("../utils/catchAsync");
const nodemailer = require('nodemailer');

//email server linking
const transporter = nodemailer.createTransport({
  service : 'gmail',
  auth: {
    user: 'chillthrive557@gmail.com',
    pass: 'ioztvzipyieurxdf'
  },
});
//email sending
const sendBookingEmail = async(booking,user)=>{
  console.log(user.email);
  const { serviceId, bookingDate, timeSlot } = booking;
    const userName = user.username || user.name || 'Customer';
    const userEmail = user.email;
    await transporter.sendMail({
      from: 'chillthrive557@gmail.com',
      to: userEmail,
      subject: 'Booking Confirmation - Chill Thrive',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #667eea;">✅ Booking Confirmed!</h2>
          
          <p>Dear ${userName},</p>
          <p>Thank you for booking with <strong>Chill Thrive</strong>!</p>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Booking Details:</h3>
            <p><strong>Service:</strong> ${serviceId}</p>
            <p><strong>Date:</strong> ${bookingDate}</p>
            <p><strong>Time:</strong> ${timeSlot}</p>
            <p><strong>Booking ID:</strong> ${booking._id || booking.id}</p>
          </div>
          
          <p>We'll contact you soon to confirm your appointment.</p>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>Chill Thrive Team</strong>
          </p>
       </div>
      `
    });

}
const createBooking = catchAsync(async (req, res) => {
  const { serviceId, bookingDate, timeSlot } = req.body;

  const booking = await bookingService.createBooking(
    req.user.id,
    serviceId,
    bookingDate,
    timeSlot
  );
  sendBookingEmail(booking, req.user).catch(err => {
    console.error('Email sending failed:', err);
  });
  ApiResponse(res, 201, "Booking created", booking);
});

const getMyBookings = catchAsync(async (req, res) => {
  const bookings = await bookingService.getUserBookings(req.user.id);
  ApiResponse(res, 200, "Bookings fetched", bookings);
});

const cancelBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.cancelBooking(
    req.params.id,
    req.user.id
  );

  ApiResponse(res, 200, "Booking cancelled", booking);
});

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
};
