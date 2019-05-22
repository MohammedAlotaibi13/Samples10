var mongoose = require("mongoose");

var paymentSchema = new mongoose.Schema({
   userId: String, 
   email: String,
   memberShip: String,
   paymentWay: String, 
   sharedOpinion: {type: Boolean , default: false},
   timeOfPayment: Date,
   status: String
})

module.exports = mongoose.model( "Payment" , paymentSchema)