var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

//Use the ^^ Schema to create a new UserSchema object
//(just like sequelize)

ArticleSchema = new Schema ({
title: {
    type: String,
    required: true,
    unique: true
},
link: {
    type: String,
    required: true,
    unique: true
},
summary: {
    type: String,
    required: false,
    unique: true
},
note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
},
imgageURL: {
    type: String,
    required: false
}


});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;