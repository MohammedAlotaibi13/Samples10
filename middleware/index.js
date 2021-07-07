var middlewareObj = {}
var expressVlidator = require("express-validator");

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "يجب عليك تسجيل الدخول اولاً")
    res.redirect("/signIn");
  }
}


middlewareObj.registerValidation = function (req, res, next) {
  req.checkBody('email', 'الرجاء كتابة الإيمل  ').notEmpty()
  req.checkBody('username', 'الرجاء كتابة اسم المستخدم  ').notEmpty()
  req.checkBody('password', 'الرجاء كتابة كلمة المرور  ').notEmpty()
  req.checkBody('password', 'كلمة المرور يجب أن تتكون من ست خانات على الأقل').isLength({ min: 5 })
  req.checkBody('confirm', 'الرجاء إعادة كتابة كلمة المرور  ').notEmpty()
  req.checkBody('confirm', 'كلمة المرور غير متطابقة ').equals(req.body.password)
  req.getValidationResult()
    .then(function (result) {
      if (result.isEmpty() === false) {
        result.array().forEach((error) => {
          req.flash("error", error.msg)
        });
        return res.redirect("back");
      } else {
        return next()
      }
    })
}

module.exports = middlewareObj;