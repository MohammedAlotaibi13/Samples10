const Payment = require("../models/payment");
const User = require("../models/user");
const paymentGate = require('./paymentGate')

module.exports.rendertoPaymentPage = (req, res) => {
    res.render("payment/payPage");
}
module.exports.createPaymentId = async (req, res) => {
    await User.findById(req.params.id, function (error, foundUser) {
        if (error) {
            console.log(error)
            res.redirect("back")
        } else {
            Payment.create({
                userId: foundUser.id,
                email: foundUser.email,
                memberShip: req.body.memberShipPicker,
                paymentWay: req.body.paymntMethod,
                sharedOpinion: req.body.opinion,
                timeOfPayment: Date.now(),
                status: "success"
            }, function (error, paymentInfo) {
                if (error) {
                    console.log(error)
                    return res.redirect("back")
                } else {
                    foundUser.payments.push(paymentInfo)
                    foundUser.save()
                }

                res.redirect('/checkout/' + paymentInfo.id + "/" + req.body.memberShipPicker)
            })
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
                    amount: '165',
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
                    amount: '199',
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
                        req.flash("success", " تم الدفع بنجاح")
                        res.redirect("/paymentResult");
                    } else {
                        userInfo.memberShip = "gold"
                        userInfo.numberOfAttempts = 1000
                        userInfo.accountExpiration = Date.now() + 5616000000 // 65 days 
                        userInfo.save()
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