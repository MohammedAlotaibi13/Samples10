var mongoose = require("mongoose");

var paymentSchema = new mongoose.Schema({
   memberShip: String, 
   timeOfPayment: Date,
   status: String
})

module.exports = mongoose.model( "Payment" , paymentSchema)