const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_KEY;
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    contact: { type: String },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    addr: [{
        line1: { type: String },
        line2: { type: String },
        city: { type: String },
        postcode: { type: String },
        country: { type: String },
    }, ],
}, { timestamps: true });

userSchema.methods.generateToken = async function() {
    const payload = {
        _id: this._id,
        email: this.email,
        isAdmin: this.isAdmin,
        isVerified: this.isVerified,
    };
    return await jwt.sign(payload, jwtKey);
};

const User = mongoose.model("users", userSchema);

const userValidate = (user) => {
    const schema = {
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6),
        contact: Joi.string().required().min(9),
        isAdmin: Joi.boolean(),
        isVerified: Joi.boolean(),
        addr: Joi.array().items(
            Joi.object().keys({
                line1: Joi.string(),
                line2: Joi.string(),
                city: Joi.string(),
                postcode: Joi.string(),
                country: Joi.string(),
            })
        ),
    };
    return Joi.validate(user, schema);
};

module.exports = { User, userValidate };