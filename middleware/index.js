var middlewareObj = {}

middlewareObj.isLoggedIn  = function (req , res , next){
  if(req.isAuthenticated()) {
    return next()
  } else {
  	req.flash("error" , "يجب عليك تسجيل الدخول اولاً")
    res.redirect("/signIn");
  }
}


module.exports = middlewareObj;