var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer")
var https = require('https');
var querystring = require('querystring')
const axios = require('axios');
var User = require("../models/user");
var Payment = require("../models/payment");
var middleware = require("../middleware/index")
var key = require("./key.json")



router.get("/", function(req, res) {
    res.render("landingPage");
})

router.get("/about", function(req, res) {
    res.render("whoWeAre");
});

router.get("/termsAndCondition", function(req, res) {
    res.render("termsAndCondition")
})

router.get("/pay/:id", middleware.isLoggedIn, function(req, res) {
    res.render("payment/payPage");
});

router.post("/pay/:id", middleware.isLoggedIn, function(req, res) {

    User.findById(req.params.id, function(error, foundUser) {
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
            }, function(error, paymentInfo) {
                if (error) {
                    console.log(error)
                    return res.redirect("back")
                } else {
                    foundUser.payments.push(paymentInfo)
                    foundUser.save()
                    console.log(paymentInfo)
                }

                res.redirect('/checkout/' + paymentInfo.id + "/" + req.body.memberShipPicker)
            })
        }
    })
})

router.get("/blog", function(req, res) {
    res.render("blog")
})

router.get("/app", function(req, res) {
    res.render("app")
})


function generateCheckoutId(obj) {

    var path = '/v1/checkouts';
    var data = querystring.stringify({
        'entityId': process.env.ENTITYID,
        'amount': obj.amount,
        'currency': "SAR",
        'paymentType': 'DB',
        'merchantTransactionId': obj.merchantTransactionId,
        'customer.email': obj.email,
        'billing.street1': 'street',
        'billing.city': 'Riyadh',
        'billing.state': 'Riyadh',
        'billing.postcode': '11564',
        'customer.givenName': 'name',
        'customer.surname': 'name',
        'billing.country': 'SA',

    });
    var options = {
        port: 443,
        host: 'oppwa.com',
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length,
            'Authorization': process.env.AUTHORIZATIONTOKE
        }
    };
    var postRequest = https.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            jsonRes = JSON.parse(chunk);
            return obj.cb(jsonRes);
        });
    });
    postRequest.write(data);
    postRequest.end();
}

router.get("/checkout/:id/:memberShip", middleware.isLoggedIn, function(req, res) {
    Payment.findById(req.params.id, function(error, foundPayment) {
        if (error) {
            console.log(error)
            res.redirect("back")
        } else {
            if (req.params.memberShip == "Pro") {
                generateCheckoutId({
                    amount: '165',
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
            } else {
                generateCheckoutId({
                    amount: '99',
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

})

function resultRequest(resourcePath, callback) {
    var path = resourcePath;
    path += '?entityId=' + process.env.ENTITYID

    const url = `https://oppwa.com${path}`;

    axios
        .get(url, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization:    process.env.AUTHORIZATIONTOKE,
            },
        })
        .then(function(response) {
            // handle success

            try {
                resDate = JSON.parse(response);
            } catch (e) {
                resData = response;
                console.log(resData.data.id);
            }

            return callback(resData.data);
        })
        .catch(function(error) {
            // handle error
            console.log(error);
        });
}


router.get("/paymentResult", function(req, res) {
    res.render("payment/paymentStatus")
})

router.get("/success/:id/:memberShip", function(req, res) {
    // Check checkout status
    console.log(req.params.memberShip)
    resultRequest(req.query.resourcePath, (response) => {
        console.log(response.result.code)
        // Check that result code match pattern from https://gate2play.docs.oppwa.com/reference/resultCodes
        if (response.result.code && /^(000\.000\.|000\.100\.1|000\.[36])/.test(response.result.code)) {
            // Create Payment instance here
            User.findById(req.params.id, function(error, userInfo) {
                if (error) {
                    console.log(error)
                } else {
                    if (req.params.memberShip == "Pro") {
                        userInfo.memberShip = "ProPlus"
                        userInfo.numberOfAttempts = 1000
                        userInfo.accountExpiration = Date.now() + 2592000000 // 30 days
                        userInfo.save()
                        req.flash("success", " تم الدفع بنجاح")
                        res.redirect("/paymentResult");
                    } else {
                        userInfo.memberShip = "goldPlus"
                        userInfo.numberOfAttempts = 1000
                        userInfo.accountExpiration = Date.now() + 5616000000 // 99 days
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

})



router.get("/profile/:id", middleware.isLoggedIn, function(req, res) {
    User.findById(req.params.id, function(error, foundUser) {
        if (error) {
            console.log(error)
            res.redirect("back")
        } else {
            res.render("profilePage", {
                foundUser: foundUser
            })
        }
    });
});

router.delete("/profile/:id", middleware.isLoggedIn, function(req, res) {
    User.findByIdAndRemove(req.params.id, function(error, foundUser) {
        if (error) {
            console.log(error);
            res.redirect("back")
        } else {
            console.log("user deleted")
            res.redirect("/")
        }
    });
});


router.get("/message", function(req, res) {
    res.render("sendToUs");
});

router.post("/send", function(req, res) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        name: "www.samples10.com",
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            type: "OAuth2",
            user: "info@samples10.com",
            serviceClient: key.client_id,
            privateKey: key.private_key,
        },
        // this only for localhost 
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"nodemailer Contact" <info@samples10.com', // sender address
        to: 'info@samples10.com', // list of receivers
        subject: 'Node testing', // Subject line
        text: 'Hello world?', // plain text body
        html: '<h3>From : </h3>' + req.body.email + '<h3>Subject: </h3>' + req.body.subject +
            '<h3> message:</h3>' + req.body.message // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        req.flash("success", "تم ارسال رسالتكم وسوف نوافيكم في أقرب وقت")
        res.redirect("/message");
    });
});

module.exports = router;