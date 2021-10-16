const express = require("express");
const mongoose = require("mongoose");
const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");
const route = express.Router();
const { Product, productValidate } = require("../models/product");
const cloudinary = require("cloudinary").v2;

//get all products from database
route.get("/", async(req, res) => {
    const products = await Product.find().populate("images");
    if (!products.length)
        return res.status(400).json({ msg: "products list is empty" });
    return res.json(products);
});

//add new product
route.post("/", authentication, async(req, res) => {
    const { error } = productValidate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });
    const product = await new Product(req.body);
    const result = await cloudinary.uploader.upload(product.icon, {
        folder: "website1",
    });
    product.icon = result.url;
    await product.save();
    res.json(product);
});

//delete product
route.delete("/:id", [authentication, authorization], async(req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ msg: "invaild product id" });
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(400).json({ msg: "product id not found" });
    return res.json({ msg: `product with id= ${id} is deleted from database` });
});

//update product details
route.put("/:id", authentication, async(req, res) => {
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
    product.images = req.body.images;
    product.price = req.body.price;
    product.color = req.body.color;
    product.size = req.body.size;
    //product icon update code
    const result = await cloudinary.uploader.upload(product.icon, {
        folder: "website1", //cloudinary folder name
    });
    product.icon = result.url;
    await product.save();
    res.json(product); //updated product data
});

//update product details
route.patch("/:id", authentication, async(req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ msg: "invaild product id" });
    const product = await Product.findByIdAndUpdate(id, req.body, {
        runValidators: true,
    });
    if (!product) return res.status(400).json({ msg: "product id not found" });
    res.json(await Product.findById(id)); //updated partically product details
});

module.exports = route;