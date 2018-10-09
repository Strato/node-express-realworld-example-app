const zenaton = require("zenaton");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/conduit");
mongoose.set("debug", true);

require("../models/User");
require("../models/Article");
require("../models/Comment");
require("../config/passport");

zenaton.Client.init(
  "QBRSYANTLO",
  "6UWEjoEMiYVSPGhkqlZA5SSacppOcAL931aqwNywp9y3Q5pVIR6SKbsh9Dt9",
  "dev"
);

require("./workflows/publishArticle");
