const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const lodgeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: String
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        lowercase: true,
        required: true,
        enum: ["apatapiti", "abundant life lodge", "celebrity lodge", "rcf futa road", "god's glory lodge", "blue roof", "only jesus hostel"],
    },
    schoolGate: {
        type: String,
        lowercase: true,
        required: true,
        enum: ["futa south gate", "futa north gate", "futa west gate"]
    },
    price: {
        type: Number,
        reuired: true,
        min: 10000,
    },
    roomsAvailable: {
        type: Number,
        required: true,
        min: 1,
    },
    typeOfLodge: {
        type: String,
        lowercase: true,
        enum: ["a room", "a room self", "room and parlour self", "2 bedroom flat", "3 bedroom flat"],
        required: true,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

});

lodgeSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Lodge', lodgeSchema);