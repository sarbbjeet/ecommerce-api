const express = require("express");
const route = express.Router();
const cloudinary = require("cloudinary").v2;
const {
    productImagesValidate,
    ProductImages,
    uploadImagesValidate,
} = require("../models/productImages");

//upload images to cloudinary
const uploadImages = async(images) => {
    const output = {
        errors: [],
        images: [],
    };
    for (let image of images) {
        try {
            const result = await cloudinary.uploader.upload(image, {
                folder: "website1",
            });
            output.images.push({ image: result.url });
        } catch ({ error }) {
            output.errors.push(error);
        }
    }
    return output;
};

//get product images
route.get("/products", async(req, res) => {
    const productImages = await ProductImages.find();
    res.json(productImages);
});

route.post("/products", async(req, res) => {
    const { error } = productImagesValidate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });
    let productImages = await ProductImages(req.body);
    //update image data with cloudinary image address
    const { errors, images } = await uploadImages(req.body.images);
    productImages.images = images;
    await productImages.save();
    res.json({ productImages, errors });
});

//upload new images of any product
//'id' means productImages array's single item
route.post("/products/:id", async(req, res) => {
    const { id } = req.params;
    //validate images array
    const { error } = uploadImagesValidate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });

    const singleProductImages = await ProductImages.findById(id);
    if (!singleProductImages)
        return res.status(400).json({ msg: "wrong product Images id" });

    //update image data with cloudinary image address
    const { errors, images } = await uploadImages(req.body.images);
    singleProductImages.images = [...singleProductImages.images, ...images];
    await singleProductImages.save();
    res.json({ singleProductImages, errors });
});
module.exports = route;