var User = require("../models/user");

module.exports.renderTofreeCourse = async (req, res) => {
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

            res.render("tests/CourseFree/index");
        }
    })
}

module.exports.renderToPaidCourse = async (req, res) => {
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

            res.render("tests/CoursePaid/index");
        }
    })
}