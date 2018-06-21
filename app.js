var express = require("express");
var app = express();
var passport = require("passport");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var localStrategy = require("passport-local");
var User          = require("./models/user");
var passportLocalMongoose = require("passport-local-mongoose");

// database

mongoose.connect("mongodb://localhost/samples10")

app.use(express.static(__dirname + "/public"));
app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret : "i love my self",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use( new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
 var username = req.body.email;
 var password = req.body.password;
 var rewritePassword = req.body.rewritePassword;
 var gender = req.body.gender;
  if (password === rewritePassword) {
      User.register(new User({username: username , email: email , gender: gender}) , password , function(error , user){
          if(error){
            console.log(error)
            return res.render("register");
          } 
            passport.authenticate("local")(req , res , function(){
                 res.redirect("/test");
            });
          
      });
  } else {
    console.log("password dont match");

  }

});


// to show logIn page
app.get("/signIn" , function(req ,res){
	res.render("signInPage");
});

// logIn logic

app.post("/signIn" , passport.authenticate("local" , {
    
    successRedirect: "/test",
    failureRedirect: "/signIn"

}) , function(req , res){

});

app.get("/message" , function(req , res){
    res.render("sendToUs");
});

app.get("/about" , function(req , res){
   res.render("whoWeAre");
});

app.get("/pay" , function(req , res){
   res.render("payPage");
});

app.get("/profile" , function(req , res){
   res.render("profilePage");
});

app.get("/result" , function(req , res){
  res.render("resultPage");
});

app.get("/test" , isLoggedIn ,function(req , res){
  res.render("testPage");
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