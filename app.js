if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require("express");
const app = express();
const path = require('path');
const passport = require("passport");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const users = require("./routes/users");
const tests = require("./routes/tests");
const index = require("./routes/index");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const ExpressError = require('./utilities/ExpressError')
const mongooseSanitize = require('express-mongo-sanitize')
const redirectSSL = require('redirect-ssl')
const timeout = require('connect-timeout');
const compression = require('compression')
const cors = require('cors');






//Mongo Data
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});
app.set('view engine', 'ejs')
app.use(timeout('10s'))
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride("_method"));
app.use(flash());


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(mongooseSanitize())
app.use(compression())


const mongoStore = MongoStore.create({
    mongoUrl: process.env.DATABASE,
    collectionName: 'sessions',
    dbName: 'samples10',
    touchAfter: 24 * 3600 // time period in seconds
})

const sessionConfig = {
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: { maxAge: 86400000 },
}


app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());



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