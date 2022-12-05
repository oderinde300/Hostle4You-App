const mongoose = require('mongoose');
const Lodge = require('../models/lodge');
const lodges = require('./futa');

mongoose.connect('mongodb://localhost:27017/hostel4you');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const houses = [
    {
        type: 'A Room',
        price: 35000
    },
    {
        type: 'A Room Self',
        price: 85000
    },
    {
        type: 'Room and Parlour Self',
        price: 115000
    },
    {
        type: '2 Bedroom Flat',
        price: 17000
    },
    {
        type: '3 Bedroom Flat',
        price: 255000
    },
]

const seedDB = async () => {
    await Lodge.deleteMany({});
    const rand5 = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i <= 2; i++) {
        const lodge = new Lodge({
            name: sample(lodges).name,
            author:'6385e26d57738af3548c3158',
            location: sample(lodges).location,
            schoolGate: sample(lodges).school_gate,
            geometry: sample(lodges).geometry,
            price: houses[rand5].price,
            typeOfLodge: houses[rand5].type,
            roomsAvailable: Math.floor(Math.random() * 10) + 1,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur saepe iusto, ea architecto illo, reprehenderit nam voluptates dolorem facere ipsum nisi molestiae quibusdam labore quod minima non impedit corporis omnis.',
            date: new Date().toDateString(),
            images: [
                {
                    url: 'https://res.cloudinary.com/emmatobiloba/image/upload/v1664526798/Hostel4You/m67gcih1mcq6se1jegla.jpg',
                    filename: 'Hostel4You/m67gcih1mcq6se1jegla',
                },
                {
                    url: 'https://res.cloudinary.com/emmatobiloba/image/upload/v1664526799/Hostel4You/jajjah0hn3etwym4suiz.jpg',
                    filename: 'Hostel4You/jajjah0hn3etwym4suiz',
                }
            ],
        });
        await lodge.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});