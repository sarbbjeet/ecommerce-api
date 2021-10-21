//multer setup to save file to cloudinary
// const multer = require("multer");
// const Datauri = require("datauri");
// const path = require("path");
// const storage = multer.memoryStorage();
// const multerUploads = multer({ storage });
// const dataUri = (req) =>
//     Datauri().format(
//         path.extname(req.file.originalname).toString(),
//         req.file.buffer
//     );

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "DEV",
    },
});

const multerUploads = multer({ storage: storage });
module.exports = { multerUploads };