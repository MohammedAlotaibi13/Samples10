const Payment = require("../models/payment");
const User = require("../models/user");
const paymentGate = require('./paymentGate')
const mailChimp = require('./mailChimp');
const { response } = require("express");
var moyasar = new (require('moyasar'))('sk_test_5b6cukWbiY9S6Md1eeR2ZYkNeWxrZns8uGVkDvPU')


module.exports.rendertoPaymentPage = async (req, res) => {
    await User.findById(req.params.id, function (error, foundUser) {
        if (error) {
            console.log(error)
        } else {
            Payment.findById(foundUser.payments[0], function (error, foundPayment) {
                if (error) {
                    console.log(error)
                } else {
                    res.render("payment/payPage", { foundPayment });
                }
            })
        }
    })
}

module.exports.createPaymentId = async (req, res) => {
    const { memberShipPicker, total, paymentMethod } = req.body

    await User.findById(req.params.id, function (error, foundUser) {
        if (error) {
            console.log(error)
            res.redirect("back")
        } else {
            try {
                const newPayment = new Payment;
                newPayment.userId = foundUser.id;
                newPayment.email = foundUser.email;
                newPayment.paymentMethod = paymentMethod
                newPayment.memberShip = memberShipPicker;
                newPayment.timeOfPayment = Date.now();
                newPayment.price = total;
                newPayment.save()
                foundUser.payments.push(newPayment)
                foundUser.save();
                mailChimp.savePaymentMailchimp(foundUser.email, foundUser.username, memberShipPicker, 'abandoned')
                res.redirect('/checkout/' + newPayment.id + "/" + paymentMethod + '/' + memberShipPicker)
            } catch (e) {
                console.log(e)
            }
        }
    })
}

module.exports.checkOutMoyasar = async (req, res) => {
    await Payment.findById(req.params.id, function (error, foundPayment) {
        if (error) {
            console.log(error)
            res.redirect('back')
        } else {
            if (req.params.paymentMethod == 'mada') {
                res.render('payment/checkoutPageMada', { foundPayment })
            } else {
                res.render('payment/checkoutPageApplePay', { foundPayment })
            }
        }
    })
}

module.exports.checkOutPage = async (req, res) => {
    await Payment.findById(req.params.id, function (error, foundPayment) {
        if (error) {
            console.log(error)
            res.redirect("back")
        } else {
            if (req.params.memberShip == "Pro") {
                paymentGate.generateCheckoutId({
                    amount: foundPayment.price,
                    merchantTransactionId: foundPayment.id,
                    email: foundPayment.email,
                    cb: (result) => {
                        res.render("payment/checkoutPage", {
                            checkoutId: result.id,
                            foundPayment: foundPayment
                        })
                    }
                })
            } else {
                paymentGate.generateCheckoutId({
                    amount: foundPayment.price,
                    merchantTransactionId: foundPayment.id,
                    email: foundPayment.email,
                    cb: (result) => {
                        console.log(result)
                        res.render("payment/checkoutPage", {
                            checkoutId: result.id,
                            foundPayment: foundPayment
                        })
                    }
                })
            }
        }
    })

}

module.exports.renderToPaymentResultPage = (req, res) => {
    res.render("payment/paymentStatus")
}

module.exports.getPaymentStatus = (req, res) => {
    // Check checkout status
    paymentGate.resultRequest(req.query.resourcePath, async (response) => {

        // Check that result code match pattern from https://gate2play.docs.oppwa.com/reference/resultCodes
        if (response.result.code && /^(000\.000\.|000\.100\.1|000\.[36])/.test(response.result.code)) {
            // Create Payment instance here
            await User.findById(req.params.id, function (error, userInfo) {
                if (error) {
                    console.log(error)
                } else {
                    if (req.params.memberShip == "Pro") {
                        userInfo.memberShip = "Pro"
                        userInfo.numberOfAttempts = 1000
                        userInfo.accountExpiration = Date.now() + 2592000000 // 30 days
                        userInfo.save()
                        paymentGate.isPaid(userInfo.payments[0], userInfo.username, userInfo.gender)
                        req.flash("success", " تم الدفع بنجاح")
                        res.redirect("/paymentResult");
                    } else {
                        userInfo.memberShip = "gold"
                        userInfo.numberOfAttempts = 1000
                        userInfo.accountExpiration = Date.now() + 5616000000 // 65 days 
                        userInfo.save()
                        paymentGate.isPaid(userInfo.payments[0], userInfo.username, userInfo.gender)
                        req.flash("success", " تم الدفع بنجاح")
                        res.redirect("/paymentResult");
                    }

                }
            })

        } else if (response.result.code && /^(800\.1[123456]0)/.test(response.result.code)) {
            // For some reasons it was not success. Check response.result.code and match it with https://gate2play.docs.oppwa.com/reference/resultCodes
            req.flash("error", "تجاوزت عدد المحاولات ، استخدم بطاقة اخرى او انتظر لمدة ٢٤ ساعة")
            res.redirect("/paymentResult")
        } else {
            req.flash("error", response.result.description)
            res.redirect("/paymentResult")
        }
    });

}

module.exports.getPaymentStatusMoyasar = async (req, res) => {
    const status = req.query.status
    const message = req.query.message
    const memberShip = req.params.memberShip

    await User.findById(req.params.id, function (error, userInfo) {
        if (error) {
            console.log(error)
        } else {
            if (status == 'paid' && memberShip == 'Pro') {
                userInfo.memberShip = "Pro"
                userInfo.numberOfAttempts = 1000
                userInfo.accountExpiration = Date.now() + 2592000000 // 30 days
                userInfo.save()
                paymentGate.isPaid(userInfo.payments[0], userInfo.username, userInfo.gender)
                req.flash("success", " تم الدفع بنجاح")
                res.redirect("/paymentResult");

            } else if (status === 'paid' && memberShip === 'Gold') {
                userInfo.memberShip = "gold"
                userInfo.numberOfAttempts = 1000
                userInfo.accountExpiration = Date.now() + 5616000000 // 65 days 
                userInfo.save()
                paymentGate.isPaid(userInfo.payments[0], userInfo.username, userInfo.gender)
                req.flash("success", " تم الدفع بنجاح")
                res.redirect("/paymentResult");
            } else {
                req.flash('error', message)
                res.redirect('/paymentResult')
            }
        }
    })

}

