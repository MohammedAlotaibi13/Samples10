const User = require("../models/user");

module.exports.rendertoDashboardPage = (req, res) => {
    res.render('admin/dashboard')
}

module.exports.updateUserData = async (req, res) => {
    await User.findOne({ email: req.body.email }, function (error, user) {
        if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
        } else {
            if (req.body.memberShip == 'Pro') {
                user.memberShip = 'Pro'
                user.numberOfAttempts = 1000
                user.accountExpiration = Date.now() + 2592000000 // 30 days
                user.save()
                req.flash("success", " تم التحديث بنجاح")
                res.redirect("back")
            } else if (req.body.memberShip == 'gold') {
                user.memberShip = "gold"
                user.numberOfAttempts = 1000
                user.accountExpiration = Date.now() + 5616000000 // 65 days
                user.save()
                req.flash("success", " تم التحديث بنجاح")
                res.redirect("back");
            } else if (req.body.accountExpiration == 'ThreeDays') {
                user.accountExpiration = Date.now() + 259200000 // 3 days
                user.numberOfAttempts = 1
                user.save()
                req.flash("success", " تم التحديث بنجاح")
                res.redirect("back")
            } else if (req.body.accountExpiration == 'oneWeek') {
                user.accountExpiration = Date.now() + 604800000 // 7 days
                user.numberOfAttempts = 2
                user.save()
                req.flash("success", " تم التحديث بنجاح")
                res.redirect("back")
            } else if (req.body.accountExpiration == 'oneMonth') {
                user.accountExpiration = Date.now() + 2592000000 // 30 days
                user.numberOfAttempts = 3
                user.save()
                req.flash("success", " تم التحديث بنجاح")
                res.redirect("back")
            } else if (req.body.accountExpiration == 'Pro') {
                user.accountExpiration = Date.now() + 2592000000 // 30 days
                user.save()
                req.flash("success", " تم التحديث بنجاح")
                res.redirect("back");
            } else if (req.body.accountExpiration == 'gold') {
                user.accountExpiration = Date.now() + 5616000000 // 65 days
                user.save()
                req.flash("success", " تم التحديث بنجاح")
                res.redirect("back");
            } else {
                req.flash("error", "You choose nothing to change")
                res.redirect("back");
            }
        }
    })
}


module.exports.rendertoFindEmailPage = (req, res) => {
    res.render('admin/findEmail')
}


module.exports.findUserEmail = async (req, res) => {
    await User.findOne({
        email: req.body.email
    }, function (error, user) {
        if (!user) {
            req.flash("error", "إيميل غير مسجل");
            return res.redirect("/forgot");
        } else if (error) {
            req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
            res.redirect("/myBag")
        } else {
            res.render('admin/dashboard', { user: user })
        }

    })
}