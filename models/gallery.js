var mongoose = require("mongoose");

//SCHEMA SETUP
var gallerySchema = new mongoose.Schema({
    image: String,
    description: String
});

module.exports = mongoose.model("Gallery", gallerySchema);