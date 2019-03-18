var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var verificationSchema = new mongoose.Schema({

   userId: {type: mongoose.Schema.Types.ObjectId , required: true , ref: "Verification"}, 
   token: {type: String, required: true}, 
   createdAt: {type: Date, required: true, default: Date.now, expires: 43200}

})


module.exports = mongoose.model( "Verification" , verificationSchema)