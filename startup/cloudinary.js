const cloudinary = require("cloudinary").v2;

// cloudinary configuration
//get config data from environment variables
const config = {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
};
cloudinary.config(config);

const cloudUploader = (image, callback) => {
    // upload image here
    cloudinary.uploader
        .upload(image)
        .then((result) => {
            callback({
                error: null,
                data: result,
            });
        })
        .catch((error) => {
            callback({
                data: null,
                error,
            });
        });
};

module.exports = { cloudUploader };