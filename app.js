var express = require("express");
var app = express();
var passport = require("passport");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var localStrategy = require("passport-local");
var User          = require("./models/user");
var passportLocalMongoose = require("passport-local-mongoose");
var nodemailer = require("nodemailer");

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

app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   next()
});

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
 var rewritePassword = req.body.rewritePassword;
 var gender = req.body.gender;
      User.register(new User({username: username , email: email , gender: gender}) , password , function(error , user){
          if(error){
            console.log(error)
            return res.render("register");
          } 
            passport.authenticate("local")(req , res , function(){
                 res.redirect("/test");
            }); 
      });
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


// logout 
app.get("/logout" , function(req, res){
  req.logout();
  res.redirect("/")
});

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
            pass: 'Mohammed@1411' // generated ethereal password
        } , 
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

app.get("/profile" , function(req , res){
   res.render("profilePage");
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