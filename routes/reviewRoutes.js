const express = require('express');
const router = express.Router({ mergeParams: true });
const Lodge = require('../models/lodge');
const Review = require('../models/review');
const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middlewear');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const lodge = await Lodge.findById(id);
    const { body, rating } = req.body.review;
    const review = new Review({ body, rating });
    review.author = req.user._id;
    lodge.reviews.push(review);
    await review.save();
    await lodge.save();
    req.flash('success', 'Successfully added your review');
    res.redirect(`/lodges/${lodge.id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Lodge.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/lodges/${id}`);
}));


module.exports = router;