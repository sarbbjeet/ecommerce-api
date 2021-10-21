const express = require("express");
const mongoose = require("mongoose");
const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");
const route = express.Router();
const { Product, productValidate } = require("../models/product");
const cloudinary = require("../utils/cloudinary");
const _ = require("lodash");

//get all products from database
route.get("/", async(req, res) => {
    const products = await Product.find().populate("images");
    if (!products.length)
        return res.status(400).json({ msg: "products list is empty" });
    return res.json(products);
});

//add new product
route.post("/", async(req, res) => {
    const { icon } = req.body;
    // console.log("icon..", icon);
    const { error } = productValidate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });
    const product = await new Product(
        _.pick(req.body, [
            "title",
            "images",
            "desc",
            "price",
            "size",
            "price",
            "category",
        ])
    );
    if (icon) {
        //user sent icon url in the form of api
        const result = await cloudinary.uploader.upload(icon, {
            folder: "website1",
        });
        product.icon = _.pick(result, ["secure_url", "public_id"]);
    }
    // await product.save();
    res.json(product);
});

//delete product
route.delete("/:id", [authentication, authorization], async(req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ msg: "invaild product id" });
    const product = await Product.findById(id);
    if (!product) return res.status(400).json({ msg: "product id not found" });
    if (product.icon) await cloudinary.uploader.destroy(product.icon.public_id);
    await Product.findByIdAndDelete(id);
    return res.json({ msg: `product with id= ${id} is deleted from database` });
});

//update product details
route.put("/:id", async(req, res) => {
    const { id } = req.params;
    const { title, desc, category, images, price, size, color, icon } = req.body; //if user want to change image
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ msg: "invaild product id" });
    let product = await Product.findById(id);
    if (!product) return res.status(400).json({ msg: "product id not found" });
    const { error } = productValidate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });

    //all paramerters expect icon
    product.title = title;
    product.desc = desc;
    product.category = category;
    product.images = images;
    product.price = price;
    product.color = color;
    product.size = size;

    //add new image
    if (icon) {
        //icon should have local image url
        //delete old image from cloudinary
        await cloudinary.uploader.destroy(product.icon.public_id);
        const result = await cloudinary.uploader.upload(icon, {
            folder: "website1", //cloudinary folder name
        });
        product.icon = _.pick(result, ["secure_url", "public_id"]);
        product.icon.local_url = icon;
    }

    await product.save();
    res.json(product); //updated product data
});

//update product details
route.patch("/:id", async(req, res) => {
    const { id } = req.params;
    const { icon } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ msg: "invaild product id" });
    //if icon available
    //firstly delete old image then save new
    if (icon) {
        await cloudinary.uploader.destroy(product.icon.public_id); //delete image
        //product icon update code
        const result = await cloudinary.uploader.upload(icon, {
            folder: "website1", //cloudinary folder name
        });
        req.body.icon = _.pick(result, ["secure_url", "public_id"]);
    }

    const product = await Product.findByIdAndUpdate(id, req.body, {
        runValidators: true,
    });
    if (!product) return res.status(400).json({ msg: "product id not found" });

    res.json(await Product.findById(id)); //updated partically product details
});

module.exports = route;