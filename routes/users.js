var express = require("express");
var router  = express.Router();
var User    = require("../models/user");
var passport = require("passport");
var nodemailer = require("nodemailer")
var async    = require("async");


router.get("/register" , function(req , res){
   res.render("users/register");
});


router.post("/register" , function(req , res){
 var email = req.body.email;
 var username = req.body.username;
 var password = req.body.password;
 var confirmPassword = req.body.confirm;
 var gender = req.body.gender;



   //validatation 
   req.checkBody('email' , 'الرجاء كتابة الإيمل  ').notEmpty()
   req.checkBody('username' , 'الرجاء كتابة اسم المستخدم  ').notEmpty()
   req.checkBody('password' , 'الرجاء كتابة كلمة المرور  ').notEmpty()
   req.checkBody('confirm' , 'الرجاء إعادة كتابة كلمة المرور  ' ).notEmpty()
   req.checkBody('confirm' , 'كلمة المرور غير متطابقة ' ).equals(password)


   req.getValidationResult()
   .then(function(result){
    if(result.isEmpty() === false) {
        result.array().forEach((error) => {
           req.flash("error" , error.msg)
        });
        res.redirect("back");
    } else {
           User.findOne({email: email} , function(error , doc) {
        if(error){
           console.log(error)
        }
          else {
            if(doc) {
             req.flash("error" , "إيميل مسجل سابقاً")
              res.redirect("back")
            }
            else {
              var newUser = new User()
              newUser.username = username;
              newUser.email = email;
              newUser.password = newUser.hashPassword(password)
              newUser.gender = gender;
              newUser.accountExpiration = Date.now() + 259200000 // 3 days
              newUser.save(function(error , user){
                   if(error){
                    req.flash("error" , "اسم مستخدم مسجل سابقاً")
                    res.redirect("back")
                   } else {
                    // sign in 
                    passport.authenticate("local")(req , res , function(){
                        res.redirect("/test");
                    });
                   }
              });
            }
          }
        });
    }
  })
      
});


router.get("/signIn" , function(req ,res){
	res.render("users/signInPage");
});

// logIn logic

router.post("/signIn" , passport.authenticate('local', {
     successRedirect: '/test', 
     failureRedirect: '/signIn', 
     failureFlash: true
}), function(req , res){
    
});


// logout 
router.get("/logout" , function(req, res){
  req.logout();
  res.redirect("/")
});


// forget Passward
router.get("/forgot" , function(req , res){
  res.render("users/forgot");
});

router.post("/forgot" , function(req , res){
    async.waterfall([
          function(done){
              crypto.randomBytes(20 , function(error , buf){
                 var token = buf.toString('hex');
                 done(error , token)
              });
          },
          function(token , done){
              User.findOne({ email: req.body.email} , function(error , user){
                  if(!user){
                      req.flash( "error" , "إيميل غير مسجل");
                      return res.redirect("/forgot");
                  }
                  
                  user.resetPasswordToken = token;
                  user.resetPasswordExpiration = Date.now() + 3600000 // 1 hour;
                  
                  user.save(function(error){
                     done(error , token , user); 
                  });
              });
          }, 
          function(token , user , done){
              var  smtpTransport = nodemailer.createTransport({
                 service : "Gmail" , 
                 auth: {
                     user: "info@samples10.com",
                     pass: ""
                 }
              });
              var mailOptions = {
                  to: user.email,
                  from: "info@samples10.com",
                  subject: "إعادة ضبط كلمة المرور",
                  text : "لإعادة ضبط كلمة المرور  \n\n" +
                         "الرجاء الضغط على الرابط في الأسفل \n\n" +
                         'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                   'اذا لم تطلب إعادة ضبط كلمة المرور الرجاء تجاهل الرسالة وسوف تبقى كلمة المرور السابقة\n'
              };
              smtpTransport.sendMail(mailOptions, function(err) {  
          console.log('mail sent');
           req.flash("success" , "تم إرسال الرسالة الى بريدك")
          done(err, 'done');
        });
          }
          ] , function(err){
             if (err) return next(err);
             res.redirect('/forgot'); 
          });
  
});

router.get("/reset/:token" , function(req , res){
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpiration: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'كلمة المرور غير صالحة أو انتهت صلاحيتها');
      return res.redirect('/forgot');
    }
    res.render('users/reset', {token: req.params.token});
  });
});


router.post("/reset/:token" , function(req , res){
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpiration: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'كلمة المرور غير صالحة أو انتهت صلاحيتها');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpiration = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
           req.flash("error", "كلمة المرور غير متطابقة");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'info@samples10.com',
          pass: ""
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'info@samples10.com',
        subject: 'تم تغير كلمة المرور',
        text: 'Hello,\n\n' +
          'هذه رسالة تاكيدية ان كلمة المرور للحساب ' + user.email + ' تم تغييرها.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash("success" , "تم تغيير كلمة المرور");
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });

});


module.exports = router ; 
