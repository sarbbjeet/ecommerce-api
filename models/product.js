const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: Array, required: true },
    color: { type: String },
    size: { type: String },
}, { timestamps: true });

const Product = mongoose.model("products", productSchema);

const productValidate = (product) => {
    const schema = {
        title: Joi.string().required(),
        desc: Joi.string().required(),
        price: Joi.number().required(),
        image: Joi.array().required(),
        category: Joi.string().required(),
        color: Joi.string(),
        size: Joi.string(),
    };

    return Joi.validate(product, schema);
};

module.exports = { Product, productValidate };