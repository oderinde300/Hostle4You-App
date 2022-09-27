const Joi = require('joi');

module.exports.lodgeSchema = Joi.object({
    lodge: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required().min(20000),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        schoolGate: Joi.string().required(),
        roomsAvailable: Joi.number().required(),
        typeOfLodge: Joi.string().required(),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(1),
    })
});