const mongoose = require("mongoose");
const Joi = require("joi");

const imagesSchema = new mongoose.Schema({
    images: { type: Array, default: [] },
});

const ProductImages = mongoose.model("productImages", imagesSchema);

const productImagesValidate = (data) => {
    const schema = {
        images: Joi.array().items(Joi.string()),
    };
    return Joi.validate(data, schema);
};

module.exports = { productImagesValidate, ProductImages };