const path = require("path");
/* no need to write try/catch any more error handled  
 by middleware unhandledError.js file */
require("express-async-errors");
const errorHandler = require("./middleware/unhandledErrors");
if (process.env.NODE_ENV !== "production")
    require("dotenv").config({ path: path.join(__dirname, ".env") });

require("./startup/db")(); //mongodb connection
const winston = require("winston");
const express = require("express");
const cloudinary = require("cloudinary").v2;

// cloudinary configuration
//get config data from environment variables
const config = {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
};
cloudinary.config(config);
/////////////////////////////////////////////////
const app = express();
app.use(express.json()); //activate json data
require("./startup/routes")(app); //manage all routes
app.use(errorHandler); //middleware/ replacement of try/catch
app.use(require("./middleware/routeNotFound")); //handle wrong url
// process.on("unhandledRejection", (ex) =>
//     winston.error(`unhandled rejections ${ex}`)
// );
const port = process.env.PORT || 3001;
app.listen(port, () => winston.info(`server is listening on ${port} port`));