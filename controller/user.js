const User = require("../models/user");
const mailChimp = require('./mailChimp')
var nodemailer = require("nodemailer");
var key = require("../routes/key.json")
var async = require("async");
var crypto = require("crypto");


module.exports.renderToRegisterPage = (req, res) => {
    res.render("users/register");
}

module.exports.createUser = async (req, res, next) => {
    const { email, password, username, gender } = req.body;
    await User.findOne({ email: email }, function (error, userFound) {
        if (error) {
            console.log(error)
        } else {
            if (!userFound) {
                try {
                    var newUser = new User()
                    newUser.username = username;
                    newUser.email = email;
                    newUser.active = true
                    newUser.password = newUser.hashPassword(password)
                    newUser.gender = gender;
                    newUser.save()
                    mailChimp.saveUserInmailChimp(email, username, gender)
                    req.flash("success", "تم التسجيل بنجاح ، يمكنك تسجيل الدخول الآن")
                    res.redirect("/signIn")
                } catch (e) {
                    console.log(e)
                }
            } else {
                req.flash("error", "إيميل مسجل سابقاً")
                return res.redirect("back")
            }
        }


    })

}


module.exports.renderToSignInPage = (req, res) => {
    res.render("users/signInPage");
}

module.exports.signInUser = (req, res) => {
    const redirectUrl = req.session.returnTo || '/myBag';
    delete req.session.returnTo;
    res.redirect(redirectUrl)

}


module.exports.logOutUser = (req, res) => {
    req.logout();
    res.redirect("/")
}


module.exports.renderToForgetPage = (req, res) => {
    res.render("users/forgot");
}

module.exports.sendNewPassowrd = (req, res) => {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (error, buf) {
                var token = buf.toString('hex');
                done(error, token)
            });
        },
        function (token, done) {
            User.findOne({
                email: req.body.email
            }, function (error, user) {
                if (!user) {
                    req.flash("error", "إيميل غير مسجل");
                    return res.redirect("/forgot");
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpiration = Date.now() + 3600000 // 1 hour;

                user.save((error) => {
                    done(error, token, user);
                });
            });
        },
        function (token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                name: "www.samples10.com",
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
            smtpTransport.sendMail(mailOptions, function (err) {
                console.log('mail sent');
                req.flash("success", "تم إرسال الرسالة الى بريدك، قد تجد الرسالة في قسم البريد الغير هام")
                done(err, 'done');
            });
        }
    ], function (err, next) {
        if (err) return next(err);
        res.redirect('/forgot');
    });

}


module.exports.renderToWriteNewPassword = async (req, res) => {
    await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpiration: {
            $gt: Date.now()
        }
    }, function (err, user) {
        if (!user) {
            req.flash('error', 'كلمة المرور غير صالحة أو انتهت صلاحيتها');
            return res.redirect('/forgot');
        }
        res.render('users/reset', {
            token: req.params.token
        });
    });
}

module.exports.createNewPassword = (req, res) => {
    async.waterfall([
        function (done) {
            User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpiration: {
                    $gt: Date.now()
                }
            }, function (err, user) {
                if (!user) {
                    req.flash('error', 'كلمة المرور غير صالحة أو انتهت صلاحيتها');
                    return res.redirect('back');
                }
                if (req.body.password === req.body.confirm) {
                    user.password = user.hashPassword(req.body.password)
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpiration = undefined;

                    user.save(function (err) {
                        req.logIn(user, function (err) {
                            done(err, user);
                        });
                    });
                } else {
                    req.flash("error", "كلمة المرور غير متطابقة");
                    return res.redirect('back');
                }
            });
        },
        function (user, done) {
            var smtpTransport = nodemailer.createTransport({
                name: "www.samples10.com",
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
                text: 'مرحباً,\n\n' +
                    'هذه رسالة تاكيدية ان كلمة المرور للحساب ' + user.email + ' تم تغييرها.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                req.flash("success", "تم تغيير كلمة المرور");
                done(err);
            });
        }
    ], function (err) {
        res.redirect('/');
    });

}