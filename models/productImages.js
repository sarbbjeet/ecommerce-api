const mongoose = require("mongoose");
const Joi = require("joi");

const imagesSchema = new mongoose.Schema({
    title: { type: String, required: "true" },
    desc: { type: String },
    images: [{ image: { type: String } }],
});

const ProductImages = mongoose.model("productImages", imagesSchema);

const productImagesValidate = (data) => {
    const schema = {
        title: Joi.string().required(),
        desc: Joi.string(),
        images: Joi.array().items(Joi.string()),
    };
    return Joi.validate(data, schema);
};

//upload images validate
const uploadImagesValidate = (data) => {
    const schema = {
        images: Joi.array().items(Joi.string().required()),
    };
    return Joi.validate(data, schema);
};

module.exports = { productImagesValidate, ProductImages, uploadImagesValidate };