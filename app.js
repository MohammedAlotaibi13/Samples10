var express = require("express");
var app = express();
var passport = require("passport");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var localStrategy = require("passport-local").Strategy;
var User = require("./models/user");
var passportLocalMongoose = require("passport-local-mongoose");
var nodemailer = require("nodemailer");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var expressVlidator = require("express-validator");
var Test = require("./models/test");
var Payment = require("./models/payment");
var users = require("./routes/users");
var tests = require("./routes/tests");
var index = require("./routes/index");
var async = require("async");
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
var https = require('https');
var querystring = require('querystring');
var GoogleStrategy = require("passport-google-oauth20");
var request = require("request")



// dataa
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise
mongoose.connect(process.env.DATABASE)









mongoose.set('useFindAndModify', false);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({
    limit: "50mb"
}))
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000
}));
app.use(methodOverride("_method"));
app.use(flash());
app.use(expressVlidator());
app.use(session({
    secret: "ilovemyself",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    ttl: 3 * 24 * 60 * 60
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
    done(null, user.id)
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(error, user) {
        done(null, user)
    })
});
passport.use(new localStrategy({
    usernameField: "email",
    passwordField: "password"
}, function(email, password, done) {
    User.findOne({
        email: email
    }, function(error, doc) {
        if (error) {
            done(error)
        } else {
            if (doc) {
                if (!doc.active) {
                    return done(null, false, (error, "يجب عليك تأكيد الحساب اولاً"));
                }
                var valid = doc.comparePassword(password, doc.password)
                if (valid) {
                    done(null, {
                        username: doc.username,
                        password: doc.password,
                        email: doc.email,
                        id: doc.id,
                        memberShip: doc.memberShip,
                        googleId: doc.googleId,
                        active: doc.active,
                        gender: doc.gender,
                        accountExpiration: doc.accountExpiration
                    })
                } else {
                    done(null, false, (error, "كلمة المرور غير صحيحة"));
                }
            } else {
                done(null, false, (error, "إيميل غير مسجل"));
            }
        }
    });
}))

// passport.use( new GoogleStrategy ({

//   // option for google creditional 
//   callbackURL: "/google/redirect",
//  clientID: "",
//  clientSecret: ""


// },(accessToken, refreshToke, profile, done) => {
//   // check if we already have the same user 
//   User.findOne({googleId: profile.id}).then((currentUser) => {
//   if(currentUser){
//     // already have the user
//     try {
//      done(null, currentUser)
//     } catch (error){
//       console.log(error)
//     }
//     } else {
//      // create new user
//       new User ({
//     username: profile.displayName,
//     googleId: profile.id,
//     email: profile.emails[0].value,
//     gender: profile.gender
//   }).save().then((newUser) =>{
//     try{
//       done(null, newUser)
//     } catch (error){
//       console.log(error)
//     }

//   })
//   }

//   })

// })
// )

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next()
});

//  config routes

app.use(users);
app.use(tests);
app.use(index);

app.listen(process.env.PORT || 3000, function() {
    console.log("app is starting");
});