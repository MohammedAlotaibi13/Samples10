var middlewareObj = {}
var expressVlidator = require("express-validator");
const User = require('../models/user')
const catchAsync = require('../utilities/catchAsync')

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  } else {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "يجب عليك تسجيل الدخول اولاً")
    res.redirect("/signIn");
  }
}

middlewareObj.isFreeMember = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log(id)
  await User.findOne({
    _id: id,
    $or: [
      { memberShip: 'Pro' },
      { memberShip: 'gold' },
      { memberShip: 'free' }
    ],
    accountExpiration: {
      $gt: Date.now()
    }
  }, function (error, userInfo) {
    console.log(userInfo)
    if (!userInfo) {
      req.flash("error", "انتهت عضوية الحساب")
      res.redirect("/myBag")
    } else if (error) {
      req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
      res.redirect("/myBag")
      next()
    } else {
      next()
    }
  });

})
middlewareObj.isProMember = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log(id)
  await User.findOne({
    _id: id,
    $or: [
      { memberShip: 'Pro' },
      { memberShip: 'gold' }
    ],
    accountExpiration: {
      $gt: Date.now()
    }
  }, function (error, userInfo) {
    console.log(userInfo)
    if (!userInfo) {
      req.flash("error", "انتهت عضوية الحساب")
      res.redirect("/myBag")
    } else if (error) {
      req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
      res.redirect("/myBag")
      next()
    } else {
      next()
    }
  });

})

middlewareObj.isGoldMember = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log(id)
  await User.findOne({
    _id: id,
    memberShip: 'gold',
    accountExpiration: {
      $gt: Date.now()
    }
  }, function (error, userInfo) {
    console.log(userInfo)
    if (!userInfo) {
      req.flash("error", "انتهت عضوية الحساب")
      res.redirect("/myBag")
    } else if (error) {
      req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
      res.redirect("/myBag")
      next()
    } else {
      next()
    }
  });

})


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