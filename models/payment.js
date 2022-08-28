const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
   userId: String,
   email: String,
   memberShip: String,
   paymentWay: String,
   timeOfPayment: Date,
   price: String,
   status: String,
   abandonedCartCoupon: {
      type: String,
      default: 'Samples15'
   },
   abandonedCartCouponExpiration: {
      type: Date,
      default: Date.now() + 518400000 // 6 days
   }
})

module.exports = mongoose.model("Payment", paymentSchema)