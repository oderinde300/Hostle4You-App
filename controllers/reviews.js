const Lodge = require('../models/lodge');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
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
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Lodge.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/lodges/${id}`);
};