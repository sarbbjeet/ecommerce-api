const productRoute = require("../route/products");
const orderRoute = require("../route/orders");
const cartRoute = require("../route/carts");
const userRoute = require("../route/user");
const uploadImages = require("../route/uploadImages");

module.exports = (app) => {
    app.use("/api/products", productRoute);
    app.use("/api/orders", orderRoute);
    app.use("/api/users", userRoute);
    app.use("/api/carts", cartRoute);
    app.use("/api/upload-images", uploadImages);
};