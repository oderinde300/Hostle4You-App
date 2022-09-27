const express = require('express');
const router = express.Router();
const Lodge = require('../models/lodge');
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, validateLodge, isAuthor } = require('../middlewear');

const locations = ["apatapiti", "abundant life lodge", "celebrity lodge", "rcf futa road", "god's glory lodge", "blue roof", "only jesus hostel"]
const schoolGates = ["futa south gate", "futa north gate", "futa west gate"];
const typeOfLodge = ["a room", "a room self", "room and parlour self", "2 bedroom flat", "3 bedroom flat"];



router.get('/', catchAsync(async (req, res) => {
    const lodges = await Lodge.find({});
    res.render('lodges/index', { lodges });
}));

router.post('/', isLoggedIn, validateLodge, catchAsync(async (req, res, next) => {
    const { name, schoolGate, location, price, roomsAvailable, description, typeOfLodge, image } = req.body.lodge;
    const date = new Date().toDateString();
    const lodge = new Lodge({
        name, schoolGate, location, price, roomsAvailable, description, typeOfLodge, image, date
    });
    lodge.author = req.user._id;
    await lodge.save();
    req.flash('success', 'Successfully made a new hostel!');
    res.redirect('/lodges');
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('lodges/new', { locations, schoolGates, typeOfLodge });
});

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const lodge = await Lodge.findById(id).populate(
        {
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }
    ).populate('author');
    if (!lodge) {
        req.flash('error', 'Cannot find the hostel');
        return res.redirect('/lodges');
    }
    req.flash('notification', 'Please do not pay for any hostel unless you meet the landlord and you see the hostel room physically');
    res.render('lodges/show', { lodge });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const lodge = await Lodge.findById(id);
    if (!lodge) {
        req.flash('error', 'Cannot find the hostel');
        return res.redirect('/lodges');
    }
    res.render('lodges/edit', { lodge, schoolGates, locations, typeOfLodge });
}));

router.put('/:id', isLoggedIn, isAuthor, validateLodge, catchAsync(async (req, res) => {
    const { id } = req.params;
    const { name, schoolGate, location, price, roomsAvailable, description, image } = req.body.lodge;
    const date = new Date().toDateString();
    const updatedLodge = await Lodge.findByIdAndUpdate(id,
        { name, schoolGate, location, price, roomsAvailable, description, image, date });
    req.flash('success', 'Successfully updated your hostel!');
    res.redirect(`/lodges/${updatedLodge.id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedLodge = await Lodge.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted hostel!');
    res.redirect('/lodges');
}));

module.exports = router;