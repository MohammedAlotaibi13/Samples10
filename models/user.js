var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username: String,
	email: { type: String , unique: true , required: true} ,
	password: String,
	gender: { type: String , required: true},
	memberShip: {type: String , required: true , default: "pro"},
	resetPasswordToken: String,
	resetPasswordExpiration: Date
});


userSchema.plugin(passportLocalMongoose , {usernameField: 'email'});

module.exports = mongoose.model("User" , userSchema);