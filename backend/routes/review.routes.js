const express = require('express');
const router = express.Router();
const reviewController = require('../controller/review.controller');

// Public route - anyone can submit a review
router.post('/', reviewController.createReview);

module.exports = router;