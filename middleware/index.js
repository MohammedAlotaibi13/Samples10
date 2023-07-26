var middlewareObj = {}
const { body, sanitizeBody, validationResult } = require('express-validator');
const User = require('../models/user')
const catchAsync = require('../utilities/catchAsync')
const mailChimp = require('../controller/mailChimp');

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
      req.flash("error", "انتهت عضوية الحساب ، يمكنك ترقية العضوية للأستمرار")
      res.redirect("/myBag")
    } else if (error) {
      req.flash("error", "حدث خطأ الرجاء المحاولة مجدداً")
      res.redirect("/myBag")
    } else {
      let numberOfAttempt = userInfo.numberOfAttempts
      userInfo.numberOfAttempts = numberOfAttempt - 1
      userInfo.save()
      mailChimp.saveUserInmailChimp(userInfo.email, userInfo.username, userInfo.gender, 0)
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
      req.flash("error", "انتهت عضوية الحساب ، يمكنك ترقية العضوية للأستمرار")
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
      req.flash("error", "انتهت عضوية الحساب ، يمكنك ترقية العضوية للأستمرار")
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

middlewareObj.registerValidation = async (req, res, next) => {
  await body('email', 'الرجاء كتابة إيميل صحيح  ').isEmail().trim().normalizeEmail().run(req)
  await body('username', 'الرجاء كتابة اسم المستخدم  ').notEmpty().trim().run(req)
  await body('password', 'كلمة المرور يجب أن تتكون من ست خانات على الأقل').isLength({ min: 5 }).trim().run(req)
  await body('confirm', 'الرجاء إعادة كتابة كلمة المرور  ').isLength({ min: 5 }).trim().run(req)
  await body('confirm', 'كلمة المرور غير متطابقة ').equals(req.body.password).run(req)
  const result = validationResult(req)
  if (result.isEmpty() === false) {
    result.array().forEach((error) => {
      req.flash("error", error.msg)
    });
    return res.redirect("back");
  } else {
    return next()
  }
}


middlewareObj.logInValidation = async (req, res, next) => {
  await body('email', 'الرجاء كتابة إيميل صحيح  ').trim().isEmail().normalizeEmail().run(req)
  await body('password', 'الإيميل أو كلمة المرور غير صحيحة').isLength({ min: 5 }).trim().run(req)
  const result = validationResult(req)
  if (result.isEmpty() === false) {
    result.array().forEach((error) => {
      req.flash("error", error.msg)
    });
    return res.redirect("back");
  } else {
    return next()
  }
}


middlewareObj.sendMessageValidation = async (req, res, next) => {
  await body('email', 'الرجاء كتابة الإيمل  ').isEmail().trim().escape().normalizeEmail().run(req)
  await body('subject', 'الرجاء كتابة عنوان الموضوع').run(req)
  await body('message', 'الرجاء كتابة الرسالة').run(req)

  const result = validationResult(req)
  if (result.isEmpty() === false) {
    result.array().forEach((error) => {
      req.flash("error", error.msg)
    });
    return res.redirect("back");
  } else {
    return next()
  }
}

middlewareObj.forgetPasswordValidation = async (req, res, next) => {
  await body('email', 'الرجاء كتابة إيميل صحيح ').isEmail().trim().normalizeEmail().run(req)
  const result = validationResult(req)
  if (result.isEmpty() === false) {
    result.array().forEach((error) => {
      req.flash("error", error.msg)
    });
    return res.redirect("back");
  } else {
    return next()
  }
}

middlewareObj.validationCreatingNewPassword = async (req, res, next) => {
  await body('password', 'كلمة المرور يجب أن تتكون من ست خانات على الأقل').isLength({ min: 5 }).trim().run(req)
  await body('confirm', 'الرجاء إعادة كتابة كلمة المرور  ').isLength({ min: 5 }).trim().run(req)
  await body('confirm', 'كلمة المرور غير متطابقة ').equals(req.body.password).run(req);
  const result = validationResult(req)
  if (result.isEmpty() === false) {
    result.array().forEach((error) => {
      req.flash("error", error.msg)
    });
    return res.redirect("back");
  } else {
    return next()
  }

}




module.exports = middlewareObj;