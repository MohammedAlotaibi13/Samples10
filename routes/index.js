const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Payment = require("../models/payment");
const middleware = require("../middleware/index")
const indexes = require('../controller/index')
const payments = require('../controller/payment')
const admin = require('../controller/admin')
const catchAsync = require('../utilities/catchAsync')





// admin page
router.get('/admin/:id/dashboard', middleware.isadmin, admin.rendertoDashboardPage)

router.put('/admin/:id/dashboard', middleware.isadmin, catchAsync(admin.updateUserData))

router.get('/admin/:id/findEmail', middleware.isadmin, admin.rendertoFindEmailPage)

router.post('/admin/:id/findEmail', middleware.isadmin, catchAsync(admin.findUserEmail))

// index Pages 
router.get("/", indexes.renderToLandingPage)

router.get("/about", indexes.renderToAboutPage);

router.get("/termsAndCondition", indexes.renderToTermsAndCondition)

router.get('/FAQ', indexes.renderToFaqPage)


router.get("/blog", indexes.renderToBlogPage)

router.get("/app", indexes.renderToAppPage)

router.get("/profile/:id", middleware.isLoggedIn, catchAsync(indexes.renderToProfilePage));

router.delete("/profile/:id", middleware.isLoggedIn, catchAsync(indexes.deleteAccount));


router.get("/message", indexes.renderToMessagePage);

router.post("/send", middleware.sendMessageValidation, catchAsync(indexes.sendMessage))

// payment pages 
router.get("/pay/:id", middleware.isLoggedIn, payments.rendertoPaymentPage);

router.post("/pay/:id", middleware.isLoggedIn, catchAsync(payments.createPaymentId))

router.get("/checkout/:id/:memberShip", middleware.isLoggedIn, payments.checkOutPage)

router.get("/paymentResult", payments.renderToPaymentResultPage)

router.get("/success/:id/:memberShip", payments.getPaymentStatus)





module.exports = router;