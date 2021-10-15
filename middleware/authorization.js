//verify user is admin or not ?
//basically this middleware depend on authentication middleware
//apply this middleware after authentication middleware
const authorization = async(req, res, next) => {
    const { user } = req;
    if (!user) return res.status(401).json({ msg: "authentication error" });
    if (!user.isAdmin) return res.status(401).json({ msg: "unauthorized user" });
    next();
};

module.exports = authorization;