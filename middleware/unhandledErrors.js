module.exports = (err, req, res, next) => {
    if (err)
        return res
            .status(500)
            .json(Object.keys(err).length ? err : { msg: "Internal server error" });
    next();
};