var express = require("express");
var app = express();
var passport = require("passport");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var localStrategy = require("passport-local").Strategy;
var User          = require("./models/user");
var passportLocalMongoose = require("passport-local-mongoose");
var nodemailer = require("nodemailer");
var async      = require("async");
var crypto     = require("crypto");
var methodOverride = require("method-override");
var flash          = require("connect-flash");
var bcrypt         = require("bcrypt");
var expressVlidator = require("express-validator");
var forge = require('node-forge');
var request = require("request");
var Test    = require("./models/test")

  // User.remove({}, function(error){
  //           if(error){
  //               console.log(error)
  //           } else {
  //               console.log("all user removed");
  //           }
  //        })

// databas
User.findOne({email: "mt2001@hotmail.com"}).populate("tests").exec(function(err , user){
    if(err){
        console.log(err);
    } else {
        console.log(user);
    }
});

mongoose.connect("mongodb://localhost/samples10")

app.use(express.static(__dirname + "/public"));
app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(methodOverride("_method"));
app.use(flash());
app.use(expressVlidator());
app.use(require("express-session")({
    secret : "i love my self",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user , done){
  done(null , user)
});
passport.deserializeUser(function(user , done){
   done(null , user)
});
passport.use(new localStrategy({
  usernameField: "email",
  passwordField: "password"
}, function(email , password , done){
     User.findOne({email:email} , function(error , doc){
        if(error) { done(error)}
        else {
          if(doc){
             var valid =  doc.comparePassword(password , doc.password)
             if(valid){
                 done(null , {
                   username: doc.username,
                   password: doc.password,
                   email: doc.email, 
                   id: doc.id, 
                   memberShip: doc.memberShip,
                   gender: doc.gender
                 })
             } else {
              done(null , false , (error ,  "كلمة المرور غير صحيحة"));
             }
          } else {
             done(null , false , (error ,  "إيميل غير مسجل"));
          }
        }
     });
}))

app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   res.locals.error       = req.flash("error");
   res.locals.success     = req.flash("success");
   next()
});


app.get("/" , function(req ,res){
     
	res.render("landingPage");
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
        if(error) {res.status(500).send("error occured")}
          else {
            if(doc) {
             res.status(500).send("email alredy exist")
            }
            else {
              var newUser = new User()
              newUser.username = username;
              newUser.email = email;
              newUser.password = newUser.hashPassword(password)
              newUser.gender = gender;
              newUser.save(function(error , user){
                   if(error){
                    res.status(500).send(" db error occured");
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


// to show logIn page
app.get("/signIn" , function(req ,res){
	res.render("signInPage");
});

// logIn logic

app.post("/signIn" , passport.authenticate('local', {
     successRedirect: '/', 
     failureRedirect: '/signIn', 
     failureFlash: true
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
                      req.flash( "error" , "إيميل غير مسجل");
                      return res.redirect("/forgot");
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
                     pass: process.env.PASS
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
          req.flash("error" , "done")
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
      req.flash('error', 'كلمة المرور غير صالحة أو انتهت صلاحيتها');
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
           req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'muhammedalotaibi13@gmail.com',
          pass: process.env.PASS
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
        req.flash('Success! Your password has been changed.');
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
            pass:  process.env.PASS // generated ethereal password
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
        req.flash("error" , "تم ارسال رسالتكم وسوف نوافيكم في أقرب وقت")
        res.redirect("/message");
    });
});

app.get("/about" , function(req , res){
   res.render("whoWeAre");
});

app.get("/pay" ,isLoggedIn, function(req , res){
   res.render("payPage");
});

app.get("/profile/:id" ,isLoggedIn, function(req , res){
   User.findById(req.params.id , function(error , foundUser){
      if(error){
        console.log(error)
        res.redirect("back")
      } else {
        res.render("profilePage" , {foundUser : foundUser})
      }
   });
});

app.get("/result/:id/test/:testName", isLoggedIn , function(req , res){
  User.findById(req.params.id , function(error , userInfo){
    if(error){
      console.log(error)
    } else {
      Test.findOne({testName: req.params.testName} , function(error , resultInfo){
        if(error){
          console.log(error)
        } else{
          res.render("resultPage" , {resultInfo: resultInfo});
        }
      })
     
    }
  })
  
});

app.get("/test/:id" , isLoggedIn ,function(req , res){
   User.findById(req.params.id , function(error , userInfo){
    if(error){
      console.log(error)
    } else{
       res.render("testPage" , {userInfo: userInfo});
    }
   })
});

app.get("/testOne/:id",isLoggedIn , function(req , res){
   console.log(req.params.id)
   res.render("testOne");
});

app.delete("/profile/:id",isLoggedIn , function(req , res){
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


// classmark code 
app.post('/result/:id', function (req, res) {
    // var headerHmacSignature = req.get("X-Classmarker-Hmac-Sha256");
     var jsonData = req.body;
    // // You are given a uniquе sеcret code when crеating a Wеbhook.
    // var secret = 'lG4NjRHhxAdbSwz';
    
    // var verified = verifyData(jsonData,headerHmacSignature,secret);
    //  console.log
    // if(verified){
        // Savе rеsults in your databasе.
        var userId = jsonData["result"]["cm_user_id"]
        var testName = jsonData["test"]["test_name"]
        var totalResult = jsonData["result"]["points_scored"]
        var listening = jsonData["category_results"][0]["points_scored"]
        var reading = jsonData["category_results"][1]["points_scored"]
        var grammar = jsonData["category_results"][2]["points_scored"]
        User.findById(userId , function(error , user) {
          if (error) {
            console.log(error)
          } else {
            Test.create({
              testName : testName,
              totalResult: totalResult,
              listening: listening , 
              reading: reading , 
              grammarAndWriting: grammar
            } , function(error , result){
              if(error){
                console.log(error)
              } else {
                result.save()
                user.tests.push(result)
                user.save()
              }
            })
          }
        })
         console.log(jsonData["result"]["cm_user_id"])
         console.log(req.body["result"]["points_scored"])
         console.log(req.body["result"]["cm_user_id"])
         console.log(req.body["category_results"][0]["points_scored"])
         console.log(req.body["category_results"][1]["points_scored"])
         console.log(req.body["category_results"][2]["points_scored"])
        // Important: Do not use a script that will take a long timе to respond.

        // Notify ClassMarker you have recеived the Wеbhook.
        res.sendStatus(200);
    // }
    // else{
    //     res.sendStatus(400)
    // }

});

var verifyData = function(jsonData,headerHmacSignature, secret)
{
    var jsonHmac = computeHmac(jsonData, secret);
    return jsonHmac == headerHmacSignature;
};

var computeHmac = function(jsonData, secret){
    var hmac = forge.hmac.create();
    hmac.start('sha256', secret);
    var jsonString = JSON.stringify(jsonData);
    var jsonBytes = new Buffer(jsonString, 'ascii');
    hmac.update(jsonBytes);
    return forge.util.encode64(hmac.digest().bytes());
};

app.listen(3000 , function(){
	console.log("app is starting");
});