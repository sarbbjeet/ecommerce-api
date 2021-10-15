const mongoose = require("mongoose");
const Joi = require("joi");
const joiObjectId = require("joi-objectid")(Joi);
const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    products: [{
        productId: { type: String, required: true },
        quantity: { type: Number, default: 1 },
    }, ],
    amount: { type: Number, required: true },
    addr: { type: Object, required: true },
    status: { type: String, default: "pending" },
}, { timestamps: true });

const Order = mongoose.model("orders", orderSchema);

const orderValidate = (order) => {
    const schema = {
        userId: joiObjectId().required(),
        products: Joi.array().items(
            Joi.object().keys({
                productId: joiObjectId().required(),
                quantity: Joi.number(),
            })
        ),
        amount: Joi.number().required(),
        addr: Joi.object().keys({
            line1: Joi.string().required(),
            line2: Joi.string(),
            city: Joi.string().required(),
            postcode: Joi.string().required(),
            country: Joi.string().required(),
        }),
        status: Joi.string(),
    };
    return Joi.validate(order, schema);
};

module.exports = { Order, orderValidate };