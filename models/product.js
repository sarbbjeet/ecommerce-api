const mongoose = require("mongoose");
const Joi = require("joi");
const joiObjectId = require("joi-objectid")(Joi);

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    icon: { type: String, required: true },
    images: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productImages",
    },
    color: { type: String },
    size: { type: String },
}, { timestamps: true });

const Product = mongoose.model("products", productSchema);

const productValidate = (product) => {
    const schema = {
        title: Joi.string().required(),
        desc: Joi.string().required(),
        price: Joi.number().required(),
        icon: Joi.string().required(),
        images: joiObjectId(),
        category: Joi.string().required(),
        color: Joi.string(),
        size: Joi.string(),
    };

    return Joi.validate(product, schema);
};

module.exports = { Product, productValidate };