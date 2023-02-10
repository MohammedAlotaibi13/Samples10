const querystring = require('querystring')
const https = require('https');
const axios = require('axios');
const Payment = require("../models/payment");
const mailChimp = require('./mailChimp')

module.exports.isPaid = (paymentId, username, gender) => {
    Payment.findById(paymentId, function (error, foundPayment) {
        if (error) {
            console.log(error)
        } else {
            foundPayment.status = "succeed";
            foundPayment.save()
            mailChimp.saveCheckOut(foundPayment.email, username, foundPayment.memberShip, foundPayment.timeOfPayment, gender, foundPayment.price)
            mailChimp.savePaymentMailchimp(foundPayment.email, username, foundPayment.memberShip, "succeed")
        }
    })

}