const Joi = require("joi");
const joiObjectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    products: [{
        productId: { type: String, required: true },
        quantity: { type: Number },
    }, ],
}, { timestamps: true });

const Cart = mongoose.model("carts", cartSchema);

const cartValidate = (cart) => {
    const schema = {
        userId: joiObjectId().required(),
        products: Joi.array().items(
            Joi.object().keys({
                productId: joiObjectId().required(),
                quantity: Joi.number(),
            })
        ),
    };
    // products: [{ productId: Joi.string().required(), quantity: Joi.number() }],
    return Joi.validate(cart, schema);
};

module.exports = { Cart, cartValidate };