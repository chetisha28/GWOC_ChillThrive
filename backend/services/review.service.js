const Review = require('../models/review.model');
const ApiError = require('../utils/ApiError');

class ReviewService {
    // Create a new review
    async createReview(reviewData) {
        try {
            const review = new Review(reviewData);
            await review.save();
            return review;
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new ApiError(400, Object.values(error.errors)[0].message);
            }
            throw new ApiError(500, 'Error creating review');
        }
    }
}

module.exports = new ReviewService();