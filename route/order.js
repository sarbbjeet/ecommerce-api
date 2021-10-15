const express = require("express");
const { Cart } = require("../models/cart");
const route = express.Router();
const { Order, orderValidate } = require("../models/order");
const { Product } = require("../models/product");
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
route.post("/", async(req, res) => {
    const { userId } = req.body;
    const { error } = orderValidate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ msg: "user id is not exist" });
    if (!(await productIdsCheck(req.body)))
        return res.status(401).json({ msg: "product id not found" });
    const order = await Order(req.body);
    await order.save();
    res.json(order);
});
//get order by id
route.get("/:id", async(req, res) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(400).json({ msg: "order is not exist" });
    // const cart = order.populate("cartId");
    res.json(order);
});
//get all orders

route.get("/", async(req, res) => {
    const orders = await Order.find();
    if (!orders.length)
        return res.status(400).json({ msg: "orders is not exist" });
    // const cart = order.populate("cartId");
    res.json(orders);
});

//update order
route.put("/:id", async(req, res) => {
    const { userId } = req.body;
    const { id } = req.params; //order id
    const { error } = orderValidate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ msg: "user id is not exist" });
    if (!(await productIdsCheck(req.body)))
        return res.status(401).json({ msg: "product id not found" });
    const order = await Order.findByIdAndUpdate(id, req.body, {
        runValidators: true,
    });
    if (!order) return res.status(400).json({ msg: "order is not exist" });
    res.json(await Order.findById(id));
});

//delete order
route.delete("/:id", async(req, res) => {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(400).json({ msg: "order id not found" });
    return res.json({ msg: `order with id= ${id} is deleted from database` });
});

module.exports = route;