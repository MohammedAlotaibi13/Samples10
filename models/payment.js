const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
   userId: String,
   email: String,
   memberShip: String,
   paymentWay: String,
   timeOfPayment: Date,
   status: String
})

module.exports = mongoose.model("Payment", paymentSchema)