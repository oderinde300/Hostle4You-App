const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const users = require('../controllers/users');


router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        catchAsync(users.login));

router.route('/logout')
    .get(users.logout);

module.exports = router;