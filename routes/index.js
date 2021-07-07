var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Payment = require("../models/payment");
var middleware = require("../middleware/index")
const indexes = require('../controller/index')
const payments = require('../controller/payment')



// index Pages 
router.get("/", indexes.renderToLandingPage)

router.get("/about", indexes.renderToAboutPage);

router.get("/termsAndCondition", indexes.renderToTermsAndCondition)

router.get("/pay/:id", middleware.isLoggedIn, function (req, res) {
    res.render("payment/payPage");
});

router.get("/blog", indexes.renderToBlogPage)

router.get("/app", indexes.renderToAppPage)

router.get("/profile/:id", middleware.isLoggedIn, indexes.renderToProfilePage);

router.delete("/profile/:id", middleware.isLoggedIn, indexes.deleteAccount);


router.get("/message", indexes.renderToMessagePage);

router.post("/send", middleware.sendMessageValidation, indexes.sendMessage)

// payment pages 
router.post("/pay/:id", middleware.isLoggedIn, payments.createPaymentId)



router.get("/checkout/:id/:memberShip", middleware.isLoggedIn, payments.checkOutPage)




router.get("/paymentResult", payments.renderToPaymentResultPage)

router.get("/success/:id/:memberShip", payments.getPaymentStatus)





module.exports = router;