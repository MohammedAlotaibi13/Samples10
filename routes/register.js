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
                res.redirect("back");
            } else {
                User.findOne({
                    email: email
                }, function(error, doc) {
                    if (error) {
                        console.log(error)
                    } else {
                        if (doc) {
                            req.flash("error", "إيميل مسجل سابقاً")
                            res.redirect("back")
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
                                    res.redirect("back")
                                } else {
                                    var token = new Verification()
                                    token.userId = newUser.id;
                                    token.token = crypto.randomBytes(16).toString('hex')
                                    token.save(function(error) {
                                        if (error) {
                                            req.flash("error", "الرجاء المحاولة مجدداً")
                                            res.redirect("back")
                                        }
                                    })
                                    mailChimp(email, username, gender)

                                    var transporter = nodemailer.createTransport({
                                        service: "Gmail",
                                        auth: {
                                            user: "info@samples10.com",
                                            pass: process.env.PASSWORD
                                        }
                                    })
                                    //
                                    var mailOptions = {
                                        to: newUser.email,
                                        from: "info@samples10.com",
                                        subject: "تنشيط الحساب",
                                        text: 'مرحباً\n\n' + 'الرجاء الضغط على الرابط لتأكيد الحساب \nhttps:\/\/' + req.headers.host + '\/conformation\/' + token.token + '.\n'
                                    }
                                    transporter.sendMail(mailOptions, function(error) {
                                        if (error) {
                                            return res.status(500).send({
                                                
                                            })
                                        }
                                        res.status(200).send("A verification email has been sent to" + newUser.email + ".")
                                    })

                                    req.flash("success", "تم إرسال رسالة تنشيط الى الإيميل المسجل")
                                    res.redirect("back")
                                }
                            });
                        }
                    }
                });
            }
        })

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
                service: "Gmail",
                auth: {
                    user: "info@samples10.com",
                    pass: process.env.PASSWORD
                }
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
                service: 'Gmail',
                auth: {
                    user: 'info@samples10.com',
                    pass: process.env.PASSWORD
                }
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



router.post("/send", function(req, res) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'info@samples10.com', // generated ethereal user
            pass: process.env.PASSWORD // generated ethereal password
        },
        // this only for localhost 
        tls: {
            rejectUnauthorized: false
        }
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