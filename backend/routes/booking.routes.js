const express = require("express");
const router = express.Router();

const bookingController = require("../controller/booking.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

// CREATE BOOKING
router.post(
  "/",
  authMiddleware,
  validate(["serviceId", "bookingDate", "timeSlot"]),
  bookingController.createBooking
);

// GET LOGGED-IN USER BOOKINGS
router.get(
  "/my",
  authMiddleware,
  bookingController.getMyBookings
);

// CANCEL BOOKING
router.delete(
  "/:id",
  authMiddleware,
  bookingController.cancelBooking
);

module.exports = router;
