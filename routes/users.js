var express = require("express");
var router = express.Router();
var passport = require("passport");
var middleware = require("../middleware/index")
var user = require('../controller/user');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
const catchAsync = require('../utilities/catchAsync')




router.get("/register", user.renderToRegisterPage);

router.post("/register", middleware.registerValidation, catchAsync(user.createUser))

router.get("/signIn", user.renderToSignInPage);

router.post("/signIn", middleware.logInValidation, passport.authenticate('local', {
    failureRedirect: '/signIn',
    failureFlash: true
}), user.signInUser);


router.get("/logout", user.logOutUser);


// forget Passward
router.get("/forgot", user.renderToForgetPage);

router.post("/forgot", middleware.forgetPasswordValidation, catchAsync(user.sendNewPassowrd));

router.get("/reset/:token", user.renderToWriteNewPassword);

router.post("/reset/:token", middleware.validationCreatingNewPassword, catchAsync(user.createNewPassword));

router.get('/auth/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));

router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/myBag',
        failureRedirect: '/signIn'
    }));


module.exports = router;