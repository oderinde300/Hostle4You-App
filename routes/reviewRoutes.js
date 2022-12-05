const express = require('express');
const router = express.Router({ mergeParams: true });
const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middlewear');
const reviews = require('../controllers/reviews');

router.route('/')
    .post(isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.route('/:reviewId')
    .delete(isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;