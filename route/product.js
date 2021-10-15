const express = require("express");
const mongoose = require("mongoose");
const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");
const route = express.Router();
const { Product, productValidate } = require("../models/product");

//get all products from database
route.get("/", [authentication, authorization], async(req, res) => {
    const products = await Product.find();
    if (!products.length)
        return res.status(400).json({ msg: "products list is empty" });
    return res.json(products);
});
//add new product
route.post("/", async(req, res) => {
    const { error } = productValidate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });
    const product = await new Product(req.body);
    await product.save();
    return res.json({ msg: "new product is added to database" });
});

//delete product
route.delete("/:id", async(req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ msg: "invaild product id" });
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(400).json({ msg: "product id not found" });
    return res.json({ msg: `product with id= ${id} is deleted from database` });
});

//update product details
route.put("/:id", async(req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ msg: "invaild product id" });
    let product = await Product.findById(id);
    if (!product) return res.status(400).json({ msg: "product id not found" });
    const { error } = productValidate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });
    //update all parameters
    product.title = req.body.title;
    product.desc = req.body.desc;
    product.category = req.body.category;
    product.image = req.body.image;
    product.price = req.body.price;
    product.color = req.body.color;
    product.size = req.body.size;
    await product.save();
    res.json({ msg: product }); //updated product data
});

//update product details
route.patch("/:id", async(req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ msg: "invaild product id" });
    const product = await Product.findByIdAndUpdate(id, req.body, {
        runValidators: true,
    });
    if (!product) return res.status(400).json({ msg: "product id not found" });
    res.json({ msg: await Product.findById(id) }); //updated partically product details
});

module.exports = route;