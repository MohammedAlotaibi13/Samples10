if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require("express");
const app = express();
const path = require('path');
const passport = require("passport");
const mongoose = require("mongoose");
const localStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const passportLocalMongoose = require("passport-local-mongoose");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const expressVlidator = require("express-validator");
const users = require("./routes/users");
const tests = require("./routes/tests");
const index = require("./routes/index");
const mailChimp = require('./controller/mailChimp')
const session = require("express-session");
const MongoStore = require('connect-mongo');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const ExpressError = require('./utilities/ExpressError')
const catchAsync = require('./utilities/catchAsync')
const mongooseSanitize = require('express-mongo-sanitize')
const redirectSSL = require('redirect-ssl')
const timeout = require('connect-timeout');
const compression = require('compression')
const cors = require('cors');
const cookieParser = require('cookie-parser')



//Mongo Data
mongoose.connect(process.env.DATABASE, {
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

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(mongooseSanitize())
app.use(compression())
app.use(cookieParser());

// const mongoStore = MongoStore.create({
//     mongoUrl: process.env.DATABASE,
//     collectionName: 'sessions',
//     dbName: 'samples10',
//     touchAfter: 24 * 3600 // time period in seconds
// })

const sessionConfig = {
    name: 'samples10',
    httpOnly: true,
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: true,
    // store: mongoStore,
    secure: true,  //only work in https not localhost
    cookie: {
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7, //for onw week
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
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
    clientID: process.env.GOOGLEAUTHCLINETID,
    clientSecret: process.env.GOOGLEAUTHCLIENTSECRET,
    callbackURL: 'https://www.samples10.com/auth/google/callback',
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
                User.findOne({ email: profile.emails[0].value }, function (error, user) {
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
                        mailChimp.saveUserInmailChimp(profile.emails[0].value, profile.displayName, profile.gender, 1)
                        return done(null, newUser)
                    }
                })

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

app.use(redirectSSL)


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