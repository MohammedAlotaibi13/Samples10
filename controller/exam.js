var User = require("../models/user");



module.exports.renderToMyBagPage = (req, res) => {
    res.render("tests/myBag")
}
module.exports.renderToAllExams = async (req, res) => {
    await User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function (error, userInfo) {
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
}


module.exports.renderToInstructionPage = async (req, res) => {
    await User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function (error, userInfo) {
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
}
module.exports.renderToExamOne = async (req, res) => {
    await User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function (error, userInfo) {
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
}

module.exports.renderToExamTwo = async (req, res) => {
    User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function (error, userInfo) {
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
}

module.exports.renderToExamThree = async (req, res) => {
    await User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function (error, userInfo) {
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
}

module.exports.renderToExamFour = async (req, res) => {
    await User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function (error, userInfo) {
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
}

module.exports.renderToExamFive = async (req, res) => {
    await User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function (error, userInfo) {
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
}

module.exports.renderToExamSix = async (req, res) => {
    await User.findOne({
        username: req.params.username,
        accountExpiration: {
            $gt: Date.now()
        },
        numberOfAttempts: {
            $gt: 0
        }
    }, function (error, userInfo) {
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
}