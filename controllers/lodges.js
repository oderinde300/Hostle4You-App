const Lodge = require('../models/lodge');
const { cloudinary } = require('../cloudinary');


const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });

const locations = [{
    name: "apatapiti",
    geometry: { type: 'Point', coordinates: [5.150029429634882, 7.2930316493042895] },

}, {
    name: "abundant life lodge",
    geometry: { type: 'Point', coordinates: [5.149502862267872, 7.2880043923689115] },
}, {
    name: "celebrity lodge",
    geometry: { type: 'Point', coordinates: [5.147953042951456, 7.287788210816539] },
}, {
    name: "rcf futa road",
    geometry: { type: 'Point', coordinates: [5.154180141933721, 7.293023314668099] },
}, {
    name: "god's glory lodge",
    geometry: { type: 'Point', coordinates: [5.148815286058573, 7.291281819888316] },
}, {
    name: "blue roof",
    geometry: { type: 'Point', coordinates: [5.149634661484489, 7.288716509617405] },
}, {
    name: "only jesus hostel",
    geometry: { type: 'Point', coordinates: [5.148510323408708, 7.290499349961679] },
}]
const schoolGates = ["futa south gate", "futa north gate", "futa west gate"];
const typeOfLodge = ["a room", "a room self", "room and parlour self", "2 bedroom flat", "3 bedroom flat"];

module.exports.index = async (req, res) => {
    const lodges = await Lodge.find({});
    res.render('lodges/index', { lodges });
};

module.exports.createLodge = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.lodge.location,
        limit: 1
    }).send()
    console.log(geoData.body.features[0].geometry.coordinates);
    res.send('OK!!!');
    const { name, schoolGate, location, price, roomsAvailable, description, typeOfLodge, image } = req.body.lodge;
    const date = new Date().toDateString();
    const coordinates = locations.find(loc => loc.name === location);
    const geometry = coordinates.geometry;
    const lodge = new Lodge({
        name, schoolGate, location, price, roomsAvailable, description, typeOfLodge, image, date, geometry
    });
    lodge.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    lodge.author = req.user._id;
    await lodge.save();
    console.log(lodge);
    req.flash('success', 'Successfully made a new hostel!');
    res.redirect(`/lodges/${lodge.id}`);
};

module.exports.renderNewForm = (req, res) => {
    res.render('lodges/new', { locations, schoolGates, typeOfLodge });
};

module.exports.showLodge = async (req, res) => {
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
};

module.exports.updateLodge = async (req, res) => {
    const { id } = req.params;
    const { name, schoolGate, location, price, roomsAvailable, description, image } = req.body.lodge;
    const date = new Date().toDateString();
    const coordinates = locations.find(loc => loc.name === location);
    const geometry = coordinates.geometry;
    const updatedLodge = await Lodge.findByIdAndUpdate(id,
        { name, schoolGate, location, price, roomsAvailable, description, image, date, geometry });
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    updatedLodge.images.push(...images);
    await updatedLodge.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await updatedLodge.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully updated your hostel!');
    res.redirect(`/lodges/${updatedLodge.id}`);
};

module.exports.deleteLodge = async (req, res) => {
    const { id } = req.params;
    const deletedLodge = await Lodge.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted hostel!');
    res.redirect('/lodges');
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const lodge = await Lodge.findById(id);
    if (!lodge) {
        req.flash('error', 'Cannot find the hostel');
        return res.redirect('/lodges');
    }
    res.render('lodges/edit', { lodge, schoolGates, locations, typeOfLodge });
};