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


middlewareObj.registerValidation = (req, res, next) => {
  req.checkBody('email', 'الرجاء كتابة الإيمل  ').isEmail().trim().escape().normalizeEmail()
  req.checkBody('username', 'الرجاء كتابة اسم المستخدم  ').notEmpty().trim().escape()
  req.checkBody('password', 'كلمة المرور يجب أن تتكون من ست خانات على الأقل').isLength({ min: 5 }).trim().escape()
  req.checkBody('confirm', 'الرجاء إعادة كتابة كلمة المرور  ').isLength({ min: 5 }).trim().escape()
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


middlewareObj.logInValidation = (req, res, next) => {
  req.checkBody('email', 'الرجاء كتابة الإيمل  ').isEmail().trim().escape().normalizeEmail()
  req.checkBody('password', 'الإيميل أو كلمة المرور غير صحيحة').isLength({ min: 5 }).trim().escape()
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


middlewareObj.sendMessageValidation = (req, res, next) => {
  req.checkBody('email', 'الرجاء كتابة الإيمل  ').isEmail().trim().escape().normalizeEmail()
  req.checkBody('subject', 'الرجاء كتابة عنوان الموضوع').escape()
  req.checkBody('message', 'الرجاء كتابة الرسالة').escape()

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

middlewareObj.forgetPasswordValidation = (req, res, next) => {
  req.checkBody('email', 'الرجاء كتابة الإيمل  ').isEmail().trim().escape().normalizeEmail()
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

middlewareObj.validationCreatingNewPassword = (req, res, next) => {
  req.checkBody('password', 'كلمة المرور يجب أن تتكون من ست خانات على الأقل').isLength({ min: 5 }).trim().escape()
  req.checkBody('confirm', 'الرجاء إعادة كتابة كلمة المرور  ').isLength({ min: 5 }).trim().escape()
  req.checkBody('confirm', 'كلمة المرور غير متطابقة ').equals(req.body.password);
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