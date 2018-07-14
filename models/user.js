var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
// bcrypt initalize
var bcrypt          = require("bcrypt-nodejs");


var userSchema = new mongoose.Schema({
	username: String,
	email: { type: String , unique: true , required: true} ,
	password: String,
	gender: { type: String , required: true},
	memberShip: {type: String , required: true , default: "gold"},
	tests: [
       {
       	type:  mongoose.Schema.Types.ObjectId,
       	ref: "Test"
       }
	], 
	testId: [
       {
       	type: mongoose.Schema.Types.ObjectId,
       	ref: "TestId"
       }

	],
	resetPasswordToken: String,
	resetPasswordExpiration: Date
});

userSchema.methods.hashPassword = function(password) {
       return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
}

userSchema.methods.comparePassword = function(password , hash){
   return bcrypt.compareSync(password , hash)
}

userSchema.plugin(passportLocalMongoose);
 module.exports = mongoose.model("User" , userSchema);

