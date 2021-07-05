var User = require("../models/user");

module.exports.renderToQuizzesPage = async (req, res) => {
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

            res.render("tests/Quizzes");
        }
    })
}

module.exports.renderToListeningQuizzes = async (req, res) => {
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

            res.render("tests/listening");
        }
    })
}

module.exports.renderToReadingQuizzes = async (req, res) => {
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

            res.render("tests/reading");
        }
    })
}

module.exports.renderToWritingQuizzes = async (req, res) => {
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

            res.render("tests/writing");
        }
    })
}

module.exports.renderToGrammarQuizzes = async (req, res) => {
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

            res.render("tests/grammar");
        }
    })
}

module.exports.renderToListeningQuizeOne = async (req, res) => {
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

            res.render("tests/Quizzes/listening/quizOne/index");
        }
    })
}



module.exports.renderToListeningQuizTwo = async (req, res) => {
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

            res.render("tests/Quizzes/listening/quizTwo/index");
        }
    })
}

module.exports.renderToListeningQuizThree = async (req, res) => {
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

            res.render("tests/Quizzes/listening/quizThree/index");
        }
    })
}

module.exports.renderToReadingQuizOne = async (req, res) => {
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

            res.render("tests/Quizzes/reading/quizOne/index");
        }
    })
}


module.exports.renderToReadingQuizTwo = async (req, res) => {
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

            res.render("tests/Quizzes/reading/quizTwo/index");
        }
    })
}

module.exports.renderToReadingQuizThree = async (req, res) => {
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

            res.render("tests/Quizzes/reading/quizThree/index");
        }
    })
}

module.exports.renderToGrammarQuizOne = async (req, res) => {
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

            res.render("tests/Quizzes/grammar/quizOne/index");
        }
    })
}

module.exports.renderToGrammarQuizTwo = async (req, res) => {
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

            res.render("tests/Quizzes/grammar/quizTwo/index");
        }
    })
}

module.exports.renderToGrammarQuizThree = async (req, res) => {
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

            res.render("tests/Quizzes/grammar/quizThree/index");
        }
    })
}

module.exports.renderToWritingQuizOne = async (req, res) => {
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

            res.render("tests/Quizzes/writing/quizOne/index");
        }
    })
}

module.exports.renderToWritingQuizTwo = async (req, res) => {
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

            res.render("tests/Quizzes/writing/quizTwo/index");
        }
    })
}


module.exports.renderToWritingQuizThree = async (req, res) => {
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

            res.render("tests/Quizzes/writing/quizThree/index");
        }
    })
}