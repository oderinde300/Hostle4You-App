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
    for (let i = 0; i <= 50; i++) {
        const lodge = new Lodge({
            name: sample(lodges).name,
            author: '6331ed5d5d08efa15b62fa3b',
            location: sample(lodges).location,
            schoolGate: sample(lodges).school_gate,
            price: houses[rand5].price,
            typeOfLodge: houses[rand5].type,
            roomsAvailable: Math.floor(Math.random() * 10) + 1,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur saepe iusto, ea architecto illo, reprehenderit nam voluptates dolorem facere ipsum nisi molestiae quibusdam labore quod minima non impedit corporis omnis.',
            image: 'https://images.unsplash.com/photo-1639589242688-4d1c3e9ec713?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80',
            date: new Date().toDateString(),
        });
        await lodge.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});