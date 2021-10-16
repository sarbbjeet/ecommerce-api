const express = require("express");
const route = express.Router();
const { Cart, cartValidate } = require("../models/cart");
const { productValidate, Product } = require("../models/product");
const { User } = require("../models/user");

//verify entered productId exists or not
const productIdsCheck = async({ products }) => {
    let result = true;
    for (let p of products) {
        const product = await Product.findById(p.productId);
        if (!product) {
            result = false;
            break;
        }
    }
    return result;
};
//get cart
route.get("/", async(req, res) => {
    const carts = await Cart.find();
    res.json({ msg: carts });
});

//add cart
route.post("/", async(req, res) => {
    const { error } = cartValidate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).json({ msg: "user is not exist" });
    if (!(await productIdsCheck(req.body)))
        return res.status(401).json({ msg: "product id not found" });
    const cart = await Cart(req.body);
    await cart.save();
    res.json({ msg: cart });
});
//update cart
route.put("/:id", async(req, res) => {
    const { id } = req.params;
    const { error } = cartValidate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).json({ msg: "user is not exist" });
    if (!(await productIdsCheck(req.body)))
        return res.status(401).json({ msg: "product id not found" });
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
        runValidators: true,
    });
    if (!cart) return res.status(400).json({ msg: "cart id not found" });
    res.json({ msg: await Cart.findById(id) }); //updated cart details
});
module.exports = route;