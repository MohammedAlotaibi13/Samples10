var express = require("express");
var app = express();
const path = require('path')
var passport = require("passport");
var mongoose = require("mongoose");
var localStrategy = require("passport-local").Strategy;
var User = require("./models/user");
var passportLocalMongoose = require("passport-local-mongoose");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var expressVlidator = require("express-validator");
var users = require("./routes/users");
var tests = require("./routes/tests");
var index = require("./routes/index");
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
var GoogleStrategy = require('passport-google-oauth2').Strategy;
const ExpressError = require('./utilities/ExpressError')
const catchAsync = require('./utilities/catchAsync')
const mongooseSanitize = require('express-mongo-sanitize')
const redirectSSL = require('redirect-ssl')
const timeout = require('connect-timeout');







// Mongo Data
mongoose.connect('mongodb://Mohammed:Mohammed1411@samples10-shard-00-00.lhbou.mongodb.net:27017,samples10-shard-00-01.lhbou.mongodb.net:27017,samples10-shard-00-02.lhbou.mongodb.net:27017/samples10?ssl=true&replicaSet=atlas-13tdgu-shard-0&authSource=admin&retryWrites=true&w=majority', {
    'useNewUrlParser': true,
    'useUnifiedTopology': true,
    'useCreateIndex': true,
    'useFindAndModify': false
});
app.set('view engine', 'ejs')
app.use(timeout('10s'))
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride("_method"));
app.use(flash());
app.use(expressVlidator());

app.use(express.urlencoded({ extended: true }));
app.use(mongooseSanitize())


const sessionConfig = {
    name: 'samples10',
    httpOnly: true,
    secret: 'ilovemyself',
    resave: false,
    saveUninitialized: true,
    //secure: true,  //only work in https not localhost
    cookie: {
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7, //for onw week
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store: new MongoStore({
        url: 'mongodb://Mohammed:Mohammed1411@samples10-shard-00-00.lhbou.mongodb.net:27017,samples10-shard-00-01.lhbou.mongodb.net:27017,samples10-shard-00-02.lhbou.mongodb.net:27017/samples10?ssl=true&replicaSet=atlas-13tdgu-shard-0&authSource=admin&retryWrites=true&w=majority',
        secret: 'ilovemyself',
        touchAfter: 24 * 3600
    })
}

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
    done(null, user.id)
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (error, user) {
        done(null, user)
    })
});

passport.use(new localStrategy({
    usernameField: "email",
    passwordField: "password",

}, function (email, password, done) {
    User.findOne({
        email: email
    }, function (error, doc) {
        if (error) {
            done(error)
        } else {
            if (doc) {
                if (doc.password == null) {
                    return done(null, false, (error, " Google الرجاء تسجيل الدخول من خلال "));
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
}));



passport.use(new GoogleStrategy({
    clientID: '55542658006-r5543l1p9rk20jme1htf8loel6gktfs7.apps.googleusercontent.com',
    clientSecret: 'FOGMGCTO-T8jwRDfkIXnzsY2',
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        User.findOne({ googleId: profile.id }, function (error, user) {
            if (user) {
                try {
                    done(error, user)
                } catch (error) {
                    console.log(error)
                }
            } else {
                const newUser = new User()
                newUser.username = profile.displayName;
                newUser.googleId = profile.id;
                newUser.email = profile.emails[0].value;
                newUser.gender = profile.gender;
                newUser.save()
                // // add mailchimp here
                return done(null, newUser)
            }

        });
    }
));


app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next()
});

// use only in production 
//app.use(redirectSSL)

//  config routes

app.use(users);
app.use(tests);
app.use(index);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Oh something went wrong';
    res.status(statusCode).render('error', { err });
})
app.use(haltOnTimeout)

function haltOnTimeout(req, res, next) {
    if (!req.timeout) next()
}
app.listen(process.env.PORT || 3000, function () {
    console.log("app is starting");
});