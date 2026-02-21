const express = require('express');
const connectDB = require('./config/db');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const serviceRoutes = require('./routes/services.routes')
const bookingRoutes = require('./routes/booking.routes');
const contactRoutes = require('./routes/contact.us.routes')
const reviewRoutes = require('./routes/review.routes')
const path = require('path');

// Load environment variables
dotenv.config();
// Connect to the database
connectDB();

const app = express();
// app.set("view engine","ejs")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'../frontend')))
app.use(morgan('dev'));
app.use(cors());

// // Root route
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Welcome to ChillThrive API',
//     status: 'Server is running',
//     availableRoutes: {
//       auth: {
//         register: 'POST /api/auth/register',
//         login: 'POST /api/auth/login'
//       },
//       services: {
//         getAll: 'GET /api/services',
//         getById: 'GET /api/services/:id',
//         create: 'POST /api/services',
//         update: 'PUT /api/services/:id',
//         delete: 'DELETE /api/services/:id'
//       },
//       bookings: {
//         create: 'POST /api/bookings',
//         get: 'GET /api/bookings/my',
//         cancel: 'DELETE /api/bookings/:id'
//       }
//     }
//   });
// });

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact',contactRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});
app.get('/contactus',(req,res)=>{
  res.sendFile(path.join(__dirname,"../frontend/contactus.html"));
})

module.exports = app;
// Serve frontend for all non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});