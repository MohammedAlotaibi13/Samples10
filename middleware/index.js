var middlewareObj = {}
const expressVlidator = require("express-validator");
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
  await User.findOne({
    _id: id,
    $or: [
      { memberShip: 'Pro' },
      { memberShip: 'gold' },
      { memberShip: 'free' },
      { memberShip: 'admin' }
    ],
    accountExpiration: {
      $gt: Date.now()
    }, numberOfAttempts: {
      $gt: 0
    }
  }, function (error, userInfo) {
    if (!userInfo) {
      req.flash("error", "انتهت عضوية الحساب او استنفدت عدد محاولات الاختبار")
      res.redirect("/myBag")
    } else if (error) {
      req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
      res.redirect("/myBag")
    } else {
      let numberOfAttempt = userInfo.numberOfAttempts
      userInfo.numberOfAttempts = numberOfAttempt - 1
      userInfo.save()
      next()
    }
  });

})

middlewareObj.isFreeMemberWithoutDeduction = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await User.findOne({
    _id: id,
    $or: [
      { memberShip: 'Pro' },
      { memberShip: 'gold' },
      { memberShip: 'free' },
      { memberShip: 'admin' }
    ],
    accountExpiration: {
      $gt: Date.now()
    }, numberOfAttempts: {
      $gt: 0
    }
  }, function (error, userInfo) {
    if (!userInfo) {
      req.flash("error", "انتهت عضوية الحساب او استنفدت عدد محاولات الاختبار")
      res.redirect("/myBag")
    } else if (error) {
      req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
      res.redirect("/myBag")
    } else {
      next()
    }
  });

})

middlewareObj.isProMember = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await User.findOne({
    _id: id,
    $or: [
      { memberShip: 'Pro' },
      { memberShip: 'gold' },
      { memberShip: 'admin' }
    ],
    accountExpiration: {
      $gt: Date.now()
    }
  }, function (error, userInfo) {
    if (!userInfo) {
      req.flash("error", "انتهت عضوية الحساب")
      res.redirect("/myBag")
    } else if (error) {
      req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
      res.redirect("/myBag")
    } else {
      next()
    }
  });

})

middlewareObj.isGoldMember = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await User.findOne({
    _id: id,
    $or: [
      { memberShip: 'gold' },
      { memberShip: 'admin' }
    ],
    accountExpiration: {
      $gt: Date.now()
    }
  }, function (error, userInfo) {
    if (!userInfo) {
      req.flash("error", "انتهت عضوية الحساب")
      res.redirect("/myBag")
    } else if (error) {
      req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
      res.redirect("/myBag")
    } else {
      next()
    }
  });

})

middlewareObj.isadmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await User.findOne({
    _id: id,
    memberShip: 'admin'
  }, function (error, userInfo) {
    if (!userInfo) {
      req.flash("error", "You dont have permission to this page")
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