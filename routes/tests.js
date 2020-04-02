var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Test = require("../models/test");
var middleware = require("../middleware/index")
const forge = require('node-forge');


router.get("/result/:testName/test/:id", middleware.isLoggedIn, function(req, res) {
    Test.findOne({
        testTaker: req.params.id,
        testName: req.params.testName
    }, function(error, userInfo) {
        if (error) {
            console.log(error)
        } else {
            res.render("tests/resultPage", {
                resultInfo: userInfo
            })
        }
    })
});
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
            req.flash("error", "انتهت عضوية الحساب او استنفذت عدد محاولات الإختبار  ")
            res.redirect("/test")
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/test")
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
            req.flash("error", "انتهت عضوية الحساب او استنفذت عدد محاولات الإختبار  ")
            res.redirect("/test")
        }
         else if (error) {
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

router.get("/ispringg" , function(req , res){
     res.render("tests/TestOne/index");
})

router.get("/course" , function(req , res){
     res.render("tests/course");
})

// classmark code 
router.post('/result', function(req, res) {
    //  var headerHmacSignature = req.get("X-Classmarker-Hmac-Sha256");
    var jsonData = req.body;
    //  // You are given a uniquе sеcret code when crеating a Wеbhook.
    //  var secret = 'lG4NjRHhxAdbSwz';

    //  var verified = verifyData(jsonData,headerHmacSignature,secret);
    // //  console.log
    //  if(verified){
    //Savе rеsults in your databasе.

    var userId = jsonData["result"]["cm_user_id"]
    var testName = jsonData["test"]["test_name"]
    var testId = jsonData["test"]["test_id"]
    var totalResult = jsonData["result"]["points_scored"]
    var listening = jsonData["category_results"][0]["points_scored"]
    var reading = jsonData["category_results"][1]["points_scored"]
    var grammar = jsonData["category_results"][2]["points_scored"]
    Test.find({
        testTaker: userId
    }, function(error, tests) {
        if (error) {
            console.log(error)
        } else {
            tests.forEach(function(test) {
                if (test.testId == testId && test.testTaker == userId) {
                    Test.findOneAndRemove({
                        testTaker: userId
                    }, function(error, testRemove) {
                        if (error) {
                            console.log(error)
                        } else {
                            console.log("test removed")
                        }
                    })
                }
            })
            Test.create({
                testName: testName,
                testId: testId,
                testTaker: userId,
                totalResult: totalResult,
                listening: listening,
                reading: reading,
                grammarAndWriting: grammar
            }, function(error, result) {
                if (error) {
                    console.log("here error")
                    console.log(error)
                } else {
                    User.findById(userId, function(error, user) {
                        if (error) {
                            console.log("another error")
                            console.log(error)
                        } else {
                            console.log("webhook" + user.numberOfAttempts)
                            result.save()
                            user.tests.push(result)
                            user.save()

                        }
                    })
                }
            })
        }
    })

    res.sendStatus(200);

});

var verifyData = function(jsonData, headerHmacSignature, secret) {
    var jsonHmac = computeHmac(jsonData, secret);
    return jsonHmac == headerHmacSignature;
};

var computeHmac = function(jsonData, secret) {
    var hmac = forge.hmac.create();
    hmac.start('sha256', secret);
    var jsonString = JSON.stringify(jsonData);
    var jsonBytes = new Buffer(jsonString, 'ascii');
    hmac.update(jsonBytes);
    return forge.util.encode64(hmac.digest().bytes());
};

module.exports = router;