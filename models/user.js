var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
// bcrypt initalize
var bcrypt          = require("bcrypt");


var userSchema = new mongoose.Schema({
	username: {type: String , unique: false},
	email: { type: String , unique: true , required: true} ,
	password: String,
	gender: { type: String , required: true},
	memberShip: {type: String , required: true , default: "pro"},
	resetPasswordToken: String,
	resetPasswordExpiration: Date
});


userSchema.plugin(passportLocalMongoose , {usernameField: 'email' ,  passwordField: 'password'});

 var User = module.exports = mongoose.model("User" , userSchema);

//  module.exports.createUser = function(newUser , callback){
//     bcrypt.genSalt(10, function(err, salt) {
// 	    bcrypt.hash(newUser.password, salt, function(err, hash) {
// 	        newUser.password = hash;
// 	        newUser.save(callback);
// 	    });
//     });
//  }

// module.exports.getUserByEmail = function(email , callback){
//    var query = {email: email}
//    User.findOne(query , callback);
// }

// module.exports.getUserById = function(id , callback){
//    User.findById(id , callback);
// }

// module.exports.comparePassword = function(userPassword , hash ,  callback){
//    bcrypt.compare(userPassword , hash , function(error , isMatch){
//        if(error)throw error;
//        callback(null , isMatch);
//    });
// }