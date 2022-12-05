const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, validateLodge, isAuthor } = require('../middlewear');
const lodges = require('../controllers/lodges')
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(lodges.index))
    .post(isLoggedIn, upload.array('image'), validateLodge, catchAsync(lodges.createLodge));

router.route('/new')
    .get(isLoggedIn, lodges.renderNewForm);

router.route('/:id')
    .get(catchAsync(lodges.showLodge))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateLodge, catchAsync(lodges.updateLodge))
    .delete(isLoggedIn, isAuthor, catchAsync(lodges.deleteLodge));

router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, catchAsync(lodges.renderEditForm));

module.exports = router;