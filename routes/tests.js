var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Test = require("../models/test");
var middleware = require("../middleware/index")
const forge = require('node-forge');

router.get("/instruction/:username", function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {
            console.log(userInfo)
            res.render("tests/instructions", {
                userInfo: userInfo
            })
        }
    })
})

router.get("/test", middleware.isLoggedIn, function(req, res) {
    res.render("tests/testPage")
})


router.get("/myBag", middleware.isLoggedIn, function(req, res) {
    res.render("tests/myBag")
});

router.get("/testOne/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/test")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/test")
            console.log(error)
        } else {
            if (userInfo.numberOfAttempts > 0) {
                userInfo.numberOfAttempts -= 1
                userInfo.save()
            } else {
                userInfo.numberOfAttempts = 0
                userInfo.save()
            }

            // res.render("tests/testOne");
            res.render("tests/TestOne/index");
        }
    });
});

router.get("/testTwo/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب او استنفذت عدد محاولات الإختبار  ")
            res.redirect("/test")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/test")
            console.log(error)
        } else {
            if (userInfo.numberOfAttempts > 0) {
                userInfo.numberOfAttempts -= 1
                userInfo.save()
            } else {
                userInfo.numberOfAttempts = 0
                userInfo.save()
            }
            // res.render("tests/testTwo");
            res.render("tests/TestTwo/index");
        }

    })
});

router.get("/testThree/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب او استنفذت عدد محاولات الإختبار  ")
            res.redirect("/test")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/test")
        } else {
            if (userInfo.numberOfAttempts > 0) {
                userInfo.numberOfAttempts -= 1
                userInfo.save()
            } else {
                userInfo.numberOfAttempts = 0
                userInfo.save()
            }
            // res.render("tests/testThree");
            res.render("tests/TestThree/index");
        }

    })
});

router.get("/testFour/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب او استنفذت عدد محاولات الإختبار  ")
            res.redirect("/test")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/test")
            console.log(error)
        } else {
            if (userInfo.numberOfAttempts > 0) {
                userInfo.numberOfAttempts -= 1
                userInfo.save()
            } else {
                userInfo.numberOfAttempts = 0
                userInfo.save()
            }
            // res.render("tests/testFour");
            res.render("tests/TestFour/index");
        }
    })
});

router.get("/testFive/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب او استنفذت عدد محاولات الإختبار  ")
            res.redirect("/test")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/test")
            console.log(error)
        } else {
            if (userInfo.numberOfAttempts > 0) {
                userInfo.numberOfAttempts -= 1
                userInfo.save()
            } else {
                userInfo.numberOfAttempts = 0
                userInfo.save()
            }
            // res.render("tests/testFive");
            res.render("tests/TestFive/index");
        }
    })
});

router.get("/testSix/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب او استنفذت عدد محاولات الإختبار  ")
            res.redirect("/test")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/test")
            console.log(error)
        } else {
            if (userInfo.numberOfAttempts > 0) {
                userInfo.numberOfAttempts -= 1
                userInfo.save()
            } else {
                userInfo.numberOfAttempts = 0
                userInfo.save()
            }
            // res.render("tests/testSix");
            res.render("tests/TestSix/index");
        }
    })
});

router.get("/testSeven/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب او استنفذت عدد محاولات الإختبار  ")
            res.redirect("/test")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/test")
            console.log(error)
        } else {
            if (userInfo.numberOfAttempts > 0) {
                userInfo.numberOfAttempts -= 1
                userInfo.save()
            } else {
                userInfo.numberOfAttempts = 0
                userInfo.save()
            }
            // res.render("tests/testSeven");
            res.render("tests/TestSeven/index");
        }
    })
});

router.get("/testEight/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب او استنفذت عدد محاولات الإختبار  ")
            res.redirect("/test")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/test")
            console.log(error)
        } else {
            if (userInfo.numberOfAttempts > 0) {
                userInfo.numberOfAttempts -= 1
                userInfo.save()
            } else {
                userInfo.numberOfAttempts = 0
                userInfo.save()
            }
            // res.render("tests/testEight");
            res.render("tests/TestEight/index");
        }
    })
});

router.get("/testNine/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب او استنفذت عدد محاولات الإختبار  ")
            res.redirect("/test")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/test")
            console.log(error)
        } else {
            if (userInfo.numberOfAttempts > 0) {
                userInfo.numberOfAttempts -= 1
                userInfo.save()
            } else {
                userInfo.numberOfAttempts = 0
                userInfo.save()
            }
            // res.render("tests/testNine");
            res.render("tests/TestNine/index");
        }
    })
});

router.get("/testTen/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب او استنفذت عدد محاولات الإختبار  ")
            res.redirect("/test")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/test")
            console.log(error)
        } else {
            if (userInfo.numberOfAttempts > 0) {
                userInfo.numberOfAttempts -= 1
                userInfo.save()
            } else {
                userInfo.numberOfAttempts = 0
                userInfo.save()
            }
            // res.render("tests/testTen");
            res.render("tests/TestTen/index");
        }
    })
});


//  New features and Course 

router.get("/Quizzes/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/Quizzes");
        }
    })
});

router.get("/listening/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/listening");
        }
    })
});


router.get("/reading/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/reading");
        }
    })
});


router.get("/writing/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/writing");
        }
    })
});

router.get("/grammar/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/grammar");
        }
    })
});

router.get("/listening/quizOne/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/Quizzes/listening/quizOne");
        }
    })
});

router.get("/listening/quizTwo/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/Quizzes/listening/quizTwo");
        }
    })
});


router.get("/listening/quizThree/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/Quizzes/listening/quizThree");
        }
    })
});

router.get("/reading/quizOne/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/Quizzes/reading/quizOne");
        }
    })
});

router.get("/reading/quizTwo/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/Quizzes/reading/quizTwo");
        }
    })
});

router.get("/reading/quizThree/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/Quizzes/reading/quizThree");
        }
    })
});


router.get("/grammar/quizOne/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/Quizzes/grammar/quizOne");
        }
    })
});


router.get("/grammar/quizTwo/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/Quizzes/grammar/quizTwo");
        }
    })
});


router.get("/grammar/quizThree/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/Quizzes/grammar/quizThree");
        }
    })
});


router.get("/writing/quizOne/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/Quizzes/writing/quizOne");
        }
    })
});


router.get("/writing/quizTwo/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/Quizzes/writing/quizTwo");
        }
    })
});


router.get("/writing/quizThree/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/Quizzes/writing/quizThree");
        }
    })
});

router.get("/trainingExamsPage/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/trainingExamsPage");
        }
    })
});


router.get("/Exam/examOne/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/Exams/examOne");
        }
    })
});



router.get("/Exam/examTwo/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/Exams/examTwo");
        }
    })
});


router.get("/Exam/examThree/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/Exams/examThree");
        }
    })
});


router.get("/Exam/examFour/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/Exams/examFour");
        }
    })
});


router.get("/Exam/examFive/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/Exams/examFive");
        }
    })
});


router.get("/Exam/examSix/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/Exams/examSix");
        }
    })
});

router.get("/courseOne/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/course");
        }
    })
})

router.get("/courseTwo/:username", middleware.isLoggedIn, function(req, res) {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function(error, userInfo) {
        if (!userInfo) {
            req.flash("error", "انتهت عضوية الحساب")
            res.redirect("/myBag")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
            console.log(error)
        } else {

            res.render("tests/paidCourse");
        }
    })
})



module.exports = router;