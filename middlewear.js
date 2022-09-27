const { lodgeSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utilities/ExpressError');
const Lodge = require('./models/lodge');
const Review = require('./models/review');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }
    next();
};

module.exports.validateLodge = ((req, res, next) => {
    const { error } = lodgeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
});

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const lodge = await Lodge.findById(id);
    if (!lodge.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that !');
        return res.redirect(`/lodges/${id}`);
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const lodge = await Review.findById(reviewId);
    if (!lodge.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that !');
        return res.redirect(`/lodges/${id}`);
    }
    next();
};