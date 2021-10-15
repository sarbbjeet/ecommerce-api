const express = require("express");
const route = express.Router();
const { Cart, cartValidate } = require("../models/cart");
const { productValidate, Product } = require("../models/product");

//get cart
route.get("/", async(req, res) => {
    const carts = await Cart.find();
    res.json({ msg: carts });
});

//add cart
route.post("/", async(req, res) => {
    const { error } = cartValidate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });
    req.body.products.map(async(p) => {
        const product = await Product.findById(p.productId);
        if (!product) return res.status(400).json({ msg: "product not found" });
    });
    const cart = await Cart(req.body);
    await cart.save();
    res.json({ msg: cart });
});
module.exports = route;