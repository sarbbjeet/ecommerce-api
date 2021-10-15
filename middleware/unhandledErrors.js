module.exports = (err, req, res, next) => {
    if (err) return res.status(500).json({ msg: "500 server error" });
    next();
};