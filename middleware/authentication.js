//middleware to verify, Is user sent correct token?
const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_KEY;
//check token
const authentication = async(req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token)
        return res.status(401).json({ msg: "Access denied: token is required" });
    //verify token
    try {
        const payload = jwt.verify(token, jwtKey);
        req.user = payload; //attach token payload data with request
    } catch (ex) {
        return res.status(401).json({ msg: "wrong token" });
    }
    next();
};

module.exports = authentication;