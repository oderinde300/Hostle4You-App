const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200,h_200,c_fill');
});

ImageSchema.virtual('carousel').get(function () {
    return this.url.replace('/upload', '/upload/w_800,h_400,c_fill');
});

ImageSchema.virtual('index').get(function () {
    return this.url.replace('/upload', '/upload/w_800,h_500,c_fill');
}); 

const opts = { toJSON: { virtuals: true } };

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
    images: [ImageSchema],
    location: {
        type: String,
        lowercase: true,
        required: true,
        enum: ["apatapiti", "abundant life lodge", "celebrity lodge", "rcf futa road", "god's glory lodge", "blue roof", "only jesus hostel"],
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
        }
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
    },

}, opts);

lodgeSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href='/lodges/${this._id}'>${this.name}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`;
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