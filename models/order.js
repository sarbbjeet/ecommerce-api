const mongoose = require("mongoose");
const Joi = require("joi");
const joiObjectId = require("joi-objectid")(Joi);
const orderSchema = new mongoose.Schema({
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
        required: true,
    },
    amount: { type: Number, required: true },
    addr: { type: Object, required: true },
    status: { type: String, default: "pending" },
}, { timestamps: true });

const Order = mongoose.model("orders", orderSchema);

const orderValidate = (order) => {
    const schema = {
        cartId: joiObjectId().required(),
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