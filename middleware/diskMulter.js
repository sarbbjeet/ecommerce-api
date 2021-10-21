//save file in disk locally storage
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // console.log(file);
        cb(null, "./uploads"); //disk storage folder location
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname); //rename filename
    },
});
const upload = multer({ storage });

module.exports = { upload };