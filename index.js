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
const cors = require("cors");
/////////////////////////////////////////////////
const app = express();
app.use(cors());
app.use(express.json()); //activate json data
require("./startup/routes")(app); //manage all routes
app.use(errorHandler); //middleware/ replacement of try/catch
app.use(require("./middleware/routeNotFound")); //handle wrong url
// process.on("unhandledRejection", (ex) =>
//     winston.error(`unhandled rejections ${ex}`)
// );
const port = process.env.PORT || 3002;
app.listen(port, () => winston.info(`server is listening on ${port} port`));