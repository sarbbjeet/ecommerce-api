const express = require("express");
const route = express.Router();
const { User, userValidate } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");

//add new user
route.post("/", async(req, res) => {
    const { error } = userValidate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ msg: "user email is already exist" });
    user = await User(req.body);
    const salt = await bcrypt.genSalt(10); //generate salt
    user.password = await bcrypt.hash(req.body.password, salt); //hashing password
    await user.save();
    const token = await user.generateToken();
    res
        .header("x-auth-token", token)
        //allow custom token otherwise x-auth-token is not accesable
        .header("Access-Control-Expose-Headers", "x-auth-token")
        .json(_.pick(user, ["_id", "name", "email", "isAdmin", "isVerified"]));
});

//login user
route.post("/login", async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: "wrong email address" });
    //decode password and compare
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) return res.status(401).json({ msg: "wrong password" });
    const token = await user.generateToken();
    res
        .header("x-auth-token", token)
        //allow custom token otherwise x-auth-token is not accesable
        .header("Access-Control-Expose-Headers", "x-auth-token")
        .json(_.pick(user, ["_id", "name", "email", "isAdmin", "isVerified"]));
});

module.exports = route;