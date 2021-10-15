const productRoute = require("../route/product");
const orderRoute = require("../route/order");
const cartRoute = require("../route/cart");
const userRoute = require("../route/user");

module.exports = (app) => {
    app.use("/api/products", productRoute);
    app.use("/api/orders", orderRoute);
    app.use("/api/users", userRoute);
    app.use("/api/carts", cartRoute);
};