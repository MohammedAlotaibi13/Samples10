var mongoose = require("mongoose");

var paymentSchema = new mongoose.Schema({
   userId: String, 
   email: String,
   memberShip: String, 
   timeOfPayment: Date,
   status: String
})

module.exports = mongoose.model( "Payment" , paymentSchema)