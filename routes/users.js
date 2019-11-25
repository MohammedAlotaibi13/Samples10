var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Verification = require("../models/Verification")
var passport = require("passport");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var async = require("async");
var GoogleStrategy = require("passport-google-oauth20")
var request = require("request")
var key = require("./key.json")




router.get("/register", function(req, res) {
    res.render("users/register");
});


router.post("/register", function(req, res) {
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var confirmPassword = req.body.confirm;
    var gender = req.body.gender;



    //validatation 
    req.checkBody('email', 'الرجاء كتابة الإيمل  ').notEmpty()
    req.checkBody('username', 'الرجاء كتابة اسم المستخدم  ').notEmpty()
    req.checkBody('password', 'الرجاء كتابة كلمة المرور  ').notEmpty()
    req.checkBody('confirm', 'الرجاء إعادة كتابة كلمة المرور  ').notEmpty()
    req.checkBody('confirm', 'كلمة المرور غير متطابقة ').equals(password)
    req.getValidationResult()
        .then(function(result) {
            if (result.isEmpty() === false) {
                result.array().forEach((error) => {
                    req.flash("error", error.msg)
                });
                return res.redirect("back");
            } else {
                User.findOne({
                    email: email
                }, function(error, doc) {
                    if (error) {
                        console.log(error)
                    } else {
                        if (doc) {
                            req.flash("error", "إيميل مسجل سابقاً")
                            return  res.redirect("back")
                        } else {
                            var newUser = new User()
                            newUser.username = username;
                            newUser.email = email;
                            newUser.active = false
                            newUser.password = newUser.hashPassword(password)
                            newUser.gender = gender;
                            newUser.save(function(error, user) {
                                if (error) {
                                    req.flash("error", "اسم مستخدم مسجل سابقاً")
                                  return  res.redirect("back")
                                } else {
                                    var token = new Verification()
                                    token.userId = newUser.id;
                                    token.token = crypto.randomBytes(16).toString('hex')
                                    token.save(function(error) {
                                        if (error) {
                                           return  res.redirect("back")
                                        }
                                    })
                                    mailChimp(email, username, gender)

                                    var transporter = nodemailer.createTransport({
                                        name:  "www.samples10.com",
                                        host: "smtp.gmail.com",
                                        port: 465,
                                        secure: true,
                                        auth: {
                                            type: "OAuth2",
                                            user: "info@samples10.com",
                                            serviceClient: key.client_id,
                                            privateKey: key.private_key,
    
                                        },
                                    })
                                    //
                                    var mailOptions = {
                                        to: newUser.email,
                                        from: "info@samples10.com",
                                        subject: "تنشيط الحساب",
                                        text: 'مرحباً\n\n' + 'الرجاء الضغط على الرابط لتأكيد الحساب \nhttps:\/\/' + req.headers.host + '\/conformation\/' + token.token + '.\n'
                                    }
                                    transporter.sendMail(mailOptions, function(error, sent) {
                                        if (error) {
                                            return res.status(500).send({
                                                error: error
                                            })
                                        }    
                                    // res.status(200).send("A verification email has been sent to" + newUser.email + ".")
                                     req.flash("success", "تم إرسال رسالة تنشيط الى الإيميل المسجل")
                                     res.redirect("back")
                                    })

                                    
                                }
                            });
                        }
                    }
                });
            }
        })

});


// router.get("/conformation/:token", function(req, res) {
//     Verification.findOne({
//         token: req.params.token
//     }, function(err, user) {
//         if (!user) {
//             req.flash('error', 'صلاحية الرابط انتهت');
//             return res.redirect("/redendVerification");
//         }
//         User.findById(user.userId, function(error, foundUser) {
//             if (error) {
//                 req.flash("error", "Prpblem with the server");
//                 return res.redirect("back")
//             } else {
//                 foundUser.active = true;
//                 foundUser.save();
//             }
//         });
//     });
//     req.flash("success", "تم تنشيط الحساب بنجاح")
//     res.redirect("/signIn")
// });
router.get("/conformation/:token", function(req, res) {
    Verification.findOne({
        token: req.params.token
    })
    .exec()
    .then(user => {
        if(!user) {
            req.flash('error', 'صلاحية الرابط انتهت');
            return res.redirect("/redendVerification");
        }
        User.findById(user.userId)
        .exec()
        .then(foundUser => {
            foundUser.active = true;
            return foundUser.save();
        }).then(result => {
            req.flash("success", "تم تنشيط الحساب بنجاح")
            res.redirect("/signIn")
        }).catch(err => {
            req.flash("error", "Prpblem with the server");
            return res.redirect("back")
        })
    }).catch(err => {
        req.flash("error", "Prpblem with the server");
        return res.redirect("back")
    })
});

router.get("/redendVerification", function(req, res) {
    res.render("users/resendVerifaction");
})


router.post("/redendVerification", function(req, res) {
    User.findOne({
        email: req.body.email
    }, function(error, user) {
        if (!user) {
            req.flash("error", "إيميل غير موجود")
            res.redirect("back")
        } else {
            var token = new Verification()
            token.userId = user.id;
            token.token = crypto.randomBytes(16).toString('hex')
            token.save(function(error) {
                if (error) {
                    req.flash("error", "الرجاء المحاولة مجدداً")
                    res.redirect("back")
                }
            })
            var transporter = nodemailer.createTransport({
                name:  "www.samples10.com",
                host: "smtp.gmail.com",
                 port: 465,
                secure: true,
                auth: {
                    type: "OAuth2",
                    user: "info@samples10.com",
                    serviceClient: key.client_id,
                    privateKey: key.private_key,
                },
            })
            var mailOptions = {
                to: user.email,
                from: "info@samples10.com",
                subject: "تنشيط الحساب",
                text: 'مرحباً,\n\n' + 'الرجاء الضغط على الرابط لتأكيد الحساب \nhttps:\/\/' + req.headers.host + '\/conformation\/' + token.token + '.\n'
            }
            transporter.sendMail(mailOptions, function(error) {
                if (error) {
                    return res.status(500).send({
                     
                    })
                }
               
            })

            req.flash("success", "تم إرسال رسالة تنشيط الى الإيميل المسجل")
           res.redirect("back")
        }
    })
})

router.get("/signIn", function(req, res) {
    res.render("users/signInPage");
});

// logIn logic

router.post("/signIn", passport.authenticate('local', {
    successRedirect: '/test',
    failureRedirect: '/signIn',
    failureFlash: true
}), function(req, res) {

});


// logout 
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/")
});

// for spring test 
router.get("/Ispring" , function(req , res){
    res.render("users/Ispring")
})


router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

router.get("/google/redirect", passport.authenticate("google", {
    failureRedirect: '/signIn'
}), function(req, res) {
    res.redirect('/test');
});

// forget Passward
router.get("/forgot", function(req, res) {
    res.render("users/forgot");
});

router.post("/forgot", function(req, res) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(error, buf) {
                var token = buf.toString('hex');
                done(error, token)
            });
        },
        function(token, done) {
            User.findOne({
                email: req.body.email
            }, function(error, user) {
                if (!user) {
                    req.flash("error", "إيميل غير مسجل");
                    return res.redirect("/forgot");
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpiration = Date.now() + 3600000 // 1 hour;

                user.save(function(error) {
                    done(error, token, user);
                });
            });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                name:  "www.samples10.com",
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    type: "OAuth2",
                    user: "info@samples10.com",
                    serviceClient: key.client_id,
                    privateKey: key.private_key,
                },
            });
            var mailOptions = {
                to: user.email,
                from: "info@samples10.com",
                subject: "إعادة ضبط كلمة المرور",
                text: "لإعادة ضبط كلمة المرور  \n\n" +
                    "الرجاء الضغط على الرابط في الأسفل \n\n" +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'اذا لم تطلب إعادة ضبط كلمة المرور الرجاء تجاهل الرسالة وسوف تبقى كلمة المرور السابقة\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                console.log('mail sent');
                req.flash("success", "تم إرسال الرسالة الى بريدك")
                done(err, 'done');
            });
        }
    ], function(err, next) {
        if (err) return next(err);
        res.redirect('/forgot');
    });

});

router.get("/reset/:token", function(req, res) {
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpiration: {
            $gt: Date.now()
        }
    }, function(err, user) {
        if (!user) {
            req.flash('error', 'كلمة المرور غير صالحة أو انتهت صلاحيتها');
            return res.redirect('/forgot');
        }
        res.render('users/reset', {
            token: req.params.token
        });
    });
});


router.post("/reset/:token", function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpiration: {
                    $gt: Date.now()
                }
            }, function(err, user) {
                if (!user) {
                    req.flash('error', 'كلمة المرور غير صالحة أو انتهت صلاحيتها');
                    return res.redirect('back');
                }
                if (req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function(err) {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpiration = undefined;

                        user.save(function(err) {
                            req.logIn(user, function(err) {
                                done(err, user);
                            });
                        });
                    })
                } else {
                    req.flash("error", "كلمة المرور غير متطابقة");
                    return res.redirect('back');
                }
            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
                name:  "www.samples10.com",
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    type: "OAuth2",
                    user: "info@samples10.com",
                    serviceClient: key.client_id,
                    privateKey: key.private_key,
                },
            });
            var mailOptions = {
                to: user.email,
                from: 'info@samples10.com',
                subject: 'تم تغير كلمة المرور',
                text: 'Hello,\n\n' +
                    'هذه رسالة تاكيدية ان كلمة المرور للحساب ' + user.email + ' تم تغييرها.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash("success", "تم تغيير كلمة المرور");
                done(err);
            });
        }
    ], function(err) {
        res.redirect('/');
    });

});


function mailChimp(email, username, gender) {
    const data = {
        members: [{
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                UNAME: username,
                GENDER: gender
            }
        }]
    }
    const postData = JSON.stringify(data)
    const option = {
        url: "https://us19.api.mailchimp.com/3.0/lists/5080ca4d5f",
        method: 'POST',
        headers: {
            Authorization: process.env.MAILCHIMPAPI
        },
        body: postData
    }

    request(option, (err, response, body) => {
        if (err) {
            console.log(err)
        } else {
            if (response.statusCode == 200) {
                console.log("done")
            } else {
                console.log(response.statusCode)
            }
        }
    })
}


module.exports = router;