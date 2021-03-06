var express = require("express");
var app = express();
var passport = require("passport");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var localStrategy = require("passport-local").Strategy;
var User          = require("./models/user");
var passportLocalMongoose = require("passport-local-mongoose");
var nodemailer = require("nodemailer");
var methodOverride = require("method-override");
var flash          = require("connect-flash");
var bcrypt         = require("bcrypt");
var expressVlidator = require("express-validator");
var Test    = require("./models/test");
var users    = require("./routes/users");
var tests    = require("./routes/tests");
var index    = require("./routes/index");
var async    = require("async");

// connect database
console.log(process.env.DATABASEURL)
console.log(process.env.PASSWORD)
mongoose.connect(process.env.DATABASEURL)

app.use(express.static("public"));
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
                   gender: doc.gender,
                   accountExpiration: doc.accountExpiration
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

//  config routes

app.use(users);
app.use(tests);
app.use(index);

app.listen(3000 , function(){
	console.log("app is starting");
});

