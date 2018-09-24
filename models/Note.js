var mongoose = require("mongoose");

//Sace a reference to the Schema Constructor
var Schema = mongoose.Schema;

//using the schema constructor, create a new NoteSchema

var NoteSchema = new Schema({
title: String,
body: String

});

//Create our model using the above schema (that uses the mongoose model method)
var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;