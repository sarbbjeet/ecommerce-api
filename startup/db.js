const mongoose = require("mongoose");
const winston = require("winston");
const db = process.env.DB_URL;
module.exports = () => {
    mongoose
        .connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        })
        .then(() => winston.info("successfully connected with db"))
        .catch((err) => winston.error(err.message));
};