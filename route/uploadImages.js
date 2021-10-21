const express = require("express");
const route = express.Router();
const cloudinary = require("cloudinary").v2;
const _ = require("lodash");
const {
    productImagesValidate,
    ProductImages,
} = require("../models/productImages");
const { upload } = require("../middleware/diskMulter"); //upload file to disk

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
            output.images.push({
                ..._.pick(result, ["secure_url", "public_id"]),
                id: Date.now().toString(),
            });
        } catch ({ error }) {
            output.errors.push(error);
        }
    }
    return output;
};

//create images array for a product
route.post("/product-images", async(req, res) => {
    let errorsBucket;

    const { error } = productImagesValidate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });
    if (req.body.images) {
        const { errors, images } = await uploadImages(req.body.images);
        req.body.images = images;
        errorsBucket = errors;
    }
    let productImages = await ProductImages(req.body);
    await productImages.save();
    res.json({ productImages, errorsBucket });
});

//add new image to images array
//id => images array id
route.get("/product-images/:id", async(req, res) => {
    const { id } = req.params;
    const singleProductImages = await ProductImages.findById(id);
    if (!singleProductImages)
        return res.status(400).json({ msg: "wrong product Images id" });
    const productImages = await ProductImages.findById(id);
    res.json(productImages);
});

//upload new images of selected product object
//'id' means productImages array's single object
route.post("/product-images/:id", async(req, res) => {
    const { id } = req.params;
    let errorsBucket;
    //validate images array
    const { error } = productImagesValidate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });
    const singleProductImages = await ProductImages.findById(id);
    if (!singleProductImages)
        return res.status(400).json({ msg: "wrong product Images id" });
    if (req.body.images) {
        const { errors, images } = await uploadImages(req.body.images);
        errorsBucket = errors;
        singleProductImages.images = [...singleProductImages.images, ...images];
    }
    await singleProductImages.save();
    res.json({ singleProductImages, errorsBucket });
});

//delete all images of selected product object
//'id' means productImages array's single object
route.delete("/product-images/:id", async(req, res) => {
    const { id } = req.params;
    const singleProductImages = await ProductImages.findByIdAndRemove(id);
    if (!singleProductImages)
        return res.status(400).json({ msg: "wrong products-Images array id" });
    res.json({
        msg: "successfully removed all images of selected product images array",
    });
});

//delete single image from product-images
route.delete("/product-images/:id/:imageId", async(req, res) => {
    const { id, imageId } = req.params;
    const singleProductImages = await ProductImages.findById(id);
    if (!singleProductImages)
        return res.status(400).json({ msg: "wrong products-Images array id" });
    await cloudinary.uploader.destroy(imageId);
    singleProductImages.images = singleProductImages.images.filter(
        (img) => img.id !== imageId
    );
    await singleProductImages.save();
    res.json({ singleProductImages });
});

//upload icon of product
//upload image ///
route.post("/product-icon", upload.single("productIcon"), async(req, res) => {
    try {
        console.log(req.file);
        res.send("success");
    } catch (ex) {
        res.status(400).json({ ex });
    }
});

module.exports = route;