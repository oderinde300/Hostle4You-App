const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    userStatus: {
        type: String,
        required: true,
        lowercase: true,
        enum: ['landlord/landlady', 'student'],
    }
});
userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('User', userSchema);