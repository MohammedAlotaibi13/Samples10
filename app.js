var express = require("express");
var app = express();
var passport = require("passport");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var localStrategy = require("passport-local");
var User          = require("./models/user");
var passportLocalMongoose = require("passport-local-mongoose");
var nodemailer = require("nodemailer");
var async      = require("async");
var crypto     = require("crypto");
var methodOverride = require("method-override");
var flash          = require("connect-flash");
var bcrypt         = require("bcrypt");
var expressVlidator = require("express-validator");

  // User.remove({}, function(error){
  //           if(error){
  //               console.log(error)
  //           } else {
  //               console.log("all user removed");
  //           }
  //       })

// databas

mongoose.connect("mongodb://localhost/samples10")

app.use(express.static(__dirname + "/public"));
app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());
app.use(expressVlidator());
app.use(require("express-session")({
    secret : "i love my self",
    resave: false,
    saveUninitialized: false
}));



// passport.use( new localStrategy(
//   function(email, passowrd, done) {
//     User.getUserByEmail(email , function(error , user){
//        if(error) throw error; 
//        if(!user){
//            return done(null , false , console.log("Email not found"));
//        }

//        User.comparePassword(passowrd , user.passowrd , function(error , isMatch){
//            if(error) throw error ;
//            if(isMatch){
//             return done(null , user);
//            } else {
//                return done(null , false , console.log("invalid passowrd"));
//            }
//        });
//     });
//   }
// ));


app.use(passport.initialize());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.session());

app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   res.locals.error       = req.flash("error");
   res.locals.success     = req.flash("success");
   next()
});
// passport.serializeUser(function(user , done){
//   done(null , user.id)
// });
// passport.deserializeUser(function(id , done){
//   User.getUserById(id , function(error , user){
//      done(error , user);
//   });
// });




app.get("/" , function(req ,res){

	res.render("landingPage" , {currentUser: req.user});
})


// to show register form

app.get("/register" , function(req , res){
   res.render("register");
});

// handle registrt

app.post("/register" , function(req , res){
 var email = req.body.email;
 var username = req.body.username;
 var password = req.body.password;
 var confirmPassword = req.body.confirm;
 var gender = req.body.gender;


 // validatation 
 // req.checkBody('email' , 'الرجاء كتابة الإيمل  ').notEmpty()
 // req.checkBody('username' , 'الرجاء كتابة اسم المستخدم  ').notEmpty()
 // req.checkBody('password' , 'الرجاء كتابة كلمة المرور  ').notEmpty()
 // req.checkBody('confirm' , 'الرجاء إعادة كتابة كلمة المرور  ' ).notEmpty()
 //  req.checkBody('confirm' , 'كلمة المرور غير متطابقة ' ).equals(password)


 // req.getValidationResult()
 // .then(function(result){
 //  if(result.isEmpty() === false) {
 //    result.array().forEach((error) => {
 //       req.flash("error" , error.msg)
 //    });
 //    res.redirect("back");
 //  } else {
 //      var newUser = new User({
 //        email: email,
 //        username: username,
 //        password: password,
 //        gender: gender
 //      })

 //      User.createUser(newUser , function(error , user) {
 //         if(error){
 //          console.log(error)
 //         } 
 //      });
 //      res.redirect("/test");
 //  }
 // });


  if(password == confirmPassword){
    User.register(new User({username: username , email: email , gender: gender}) , password , function(error , user){
          if(error){
            console.log(error)
            return res.render("register" , {error: "اسم المستخدم او الإيمل مسجل مسبقاً"});
          } 
            passport.authenticate("local")(req , res , function(){
                 res.redirect("/test");
            }); 
      });

  } else {
    req.flash("error" , "كلمة المرور غير متطابقة");
    res.redirect("back");
  }
      
});


// to show logIn page
app.get("/signIn" , function(req ,res){
	res.render("signInPage");
});

// logIn logic

app.post("/signIn" , passport.authenticate('local', {
     successRedirect: '/result', 
     failureRedirect: '/signIn'
}), function(req , res){
    
});


// logout 
app.get("/logout" , function(req, res){
  req.logout();
  res.redirect("/")
});

// forget password 

app.get("/forgot" , function(req , res){
  res.render("forgot");
});

app.post("/forgot" , function(req , res){
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
                      console.log("error email");
                      return res.redirect("/forget");
                  }
                  
                  user.resetPasswordToken = token;
                  user.resetPasswordExpiration = Date.now() + 36000000;
                  
                  user.save(function(error){
                     done(error , token , user); 
                  });
              });
          }, 
          function(token , user , done){
              var  smtpTransport = nodemailer.createTransport({
                 service : "Gmail" , 
                 auth: {
                     user: "muhammedalotaibi13@gmail.com",
                     pass: 
                 }
              });
              var mailOptions = {
                  to: user.email,
                  from: "muhammedalotaibi13@gmail.com",
                  subject: "forget Password",
                  text : "You forget your passowrd please don't do it again \n\n" +
                         "Please click the link \n\n" +
                         'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                   'If you did not request this, please ignore this email and your password will remain unchanged.\n'
              };
              smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          done(err, 'done');
        });
          }
          ] , function(err){
             if (err) return next(err);
      res.redirect('/forgot'); 
          });
  
});

app.get("/reset/:token" , function(req , res){
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpiration: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      console.log('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});


app.post("/reset/:token" , function(req , res){
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpiration: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          console.log('Password reset token is invalid or has expired.');
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
            console.log("Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'muhammedalotaibi13@gmail.com',
          pass: 
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'muhammedalotaibi13@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });

});

// contact us page 

app.get("/message" , function(req , res){
    res.render("sendToUs");
});

app.post("/send" , function(req , res){  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'muhammedalotaibi13@gmail.com', // generated ethereal user
            pass:  // generated ethereal password
        } , 
        // this only for localhost 
        tls: {
          rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"nodemailer Contact" <muhammedalotaibi13@gmail.com>', // sender address
        to: 'mt2001@hotmail.com', // list of receivers
        subject: 'Node testing', // Subject line
        text: 'Hello world?', // plain text body
        html: '<h3>From : </h3>' + req.body.email + '<h3>Subject: </h3>' + req.body.subject +
        '<h3> message:</h3>' + req.body.message // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        res.render("landingPage");
    });
});

app.get("/about" , function(req , res){
   res.render("whoWeAre");
});

app.get("/pay" , function(req , res){
   res.render("payPage");
});

app.get("/profile/:id" , function(req , res){
   User.findById(req.params.id , function(error , foundUser){
      if(error){
        console.log(error)
        res.redirect("back")
      } else {
        res.render("profilePage" , {foundUser : foundUser})
      }
   });
});

app.get("/result" , function(req , res){
  res.render("resultPage");
});

app.get("/test" , isLoggedIn ,function(req , res){
  res.render("testPage");
});

app.get("/testOne" , function(req , res){
   res.render("testOne");
});

app.delete("/profile/:id" , function(req , res){
  User.findByIdAndRemove(req.params.id , function(error , foundUser){
     if(error){
       console.log(error);
       res.redirect("back")
     } else {
       console.log("user deleted")
       res.redirect("/")
     }
  });
});


function isLoggedIn(req , res , next){
  if(req.isAuthenticated()) {
    return next()
  } else {
    res.redirect("/signIn");
  }
}


app.listen(3000 , function(){
	console.log("app is starting");
});