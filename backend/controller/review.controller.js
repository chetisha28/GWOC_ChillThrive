const reviewService = require('../services/review.service');
const ApiResponse = require('../utils/ApiResponse');
const catchAsync = require('../utils/catchAsync');

// Create a new review
const createReview = catchAsync(async (req, res) => {
    const { name, review, rating } = req.body;
    
    const newReview = await reviewService.createReview({
        name,
        review,
        rating: parseInt(rating)
    });

    ApiResponse(res, 201, 'Review submitted successfully!', newReview);
});

module.exports = {
    createReview
};