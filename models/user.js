var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username: String,
	email: { type: String , unique: true , required: true} ,
	password: String,
	gender: String 
});


userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User" , userSchema);