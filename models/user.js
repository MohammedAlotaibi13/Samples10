var mongoose = require("mongoose");
// bcrypt initalize
var bcrypt          = require("bcrypt-nodejs");


var userSchema = new mongoose.Schema({
	username: String,
	email: { type: String , unique: true , required: true} ,
	password: String,
	gender: { type: String , required: true},
	memberShip: {type: String , required: true , default: "pro"},
	tests: [
       {
       	type:  mongoose.Schema.Types.ObjectId,
       	ref: "Test"
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


 module.exports = mongoose.model("User" , userSchema);

