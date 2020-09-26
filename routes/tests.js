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

            res.render("tests/Quizzes/listening/quizOne/index");
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

            res.render("tests/Quizzes/listening/quizTwo/index");
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

            res.render("tests/Quizzes/listening/quizThree/index");
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

            res.render("tests/Quizzes/reading/quizOne/index");
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

            res.render("tests/Quizzes/reading/quizTwo/index");
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

            res.render("tests/Quizzes/reading/quizThree/index");
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

            res.render("tests/Quizzes/grammar/quizOne/index");
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

            res.render("tests/Quizzes/grammar/quizTwo/index");
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

            res.render("tests/Quizzes/grammar/quizThree/index");
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

            res.render("tests/Quizzes/writing/quizOne/index");
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

            res.render("tests/Quizzes/writing/quizTwo/index");
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

            res.render("tests/Quizzes/writing/quizThree/index");
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

            res.render("tests/Exams/examOne/index");
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

            res.render("tests/Exams/examTwo/index");
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

            res.render("tests/Exams/examThree/index");
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

            res.render("tests/Exams/examFour/index");
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

            res.render("tests/Exams/examFive/index");
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

            res.render("tests/Exams/examSix/index");
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

            res.render("tests/CourseFree/index");
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

            res.render("tests/CoursePaid/index");
        }
    })
})



module.exports = router;