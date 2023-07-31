const User = require("../models/user");
const Token = require("../models/token");
const mailChimp = require('./mailChimp');
const sendEmail = require('./sendEmail');
var passport = require('passport');
var LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20')
const crypto = require("crypto");
const bcrypt = require("bcrypt");







passport.serializeUser(function (user, done) {
    done(null, user.id)
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (error, user) {
        done(null, user)
    })
});

passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
}, async function verify(email, password, done) {
    await User.findOne({ email: email }, async function (error, row) {
        if (error) { return done(error) };
        if (!row) { return done(null, false, (error, "إيميل غير مسجل")) }
        if (!row.password) { return done(null, false, (error, "Google الرجاء تسجيل الدخول عن طريق")) }
        const isValid = await bcrypt.compare(password, row.password)
        if (!isValid) { return done(null, false, (error, "كلمة المرور غير صحيحة")) }
        return done(null, row)
    })
}))

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLEAUTHCLINETID,
    clientSecret: process.env.GOOGLEAUTHCLIENTSECRET,
    callbackURL: 'https://www.samples10.com/auth/google/callback',
    scope: ['profile', 'email'],
    state: true
}, async function verify(accessToken, refreshToken, profile, done) {
    await User.findOne({ email: profile.emails[0].value }, function (error, user) {
        if (error) { return done(error) }
        if (user) { return done(null, user) }
        const newUser = new User()
        newUser.username = profile.displayName;
        newUser.googleId = profile.id;
        newUser.email = profile.emails[0].value;
        newUser.gender = profile.gender;
        newUser.save()
        // // add mailchimp here
        mailChimp.saveUserInmailChimp(profile.emails[0].value, profile.displayName, profile.gender, 1)
        return done(null, newUser)

    })
}
));




module.exports.renderToRegisterPage = (req, res) => {
    res.render("users/register");
}

module.exports.createUser = async (req, res, next) => {
    const { email, password, username, gender } = req.body;
    const { valid, reason, validators } = await mailChimp.isEmailValid(email);
    if (!valid) {
        req.flash("error", "الرجاء كتابة إيميل صحيح")
        return res.redirect("back")
    }
    await User.findOne({ email: email }, function (error, userFound) {
        if (error) { return console.log(error) }
        if (userFound) {
            req.flash("error", "إيميل مسجل سابقاً")
            return res.redirect("back")
        }
        const newUser = new User()
        newUser.username = username;
        newUser.email = email;
        newUser.active = true
        newUser.password = password;
        newUser.gender = gender;
        newUser.save()
        mailChimp.saveUserInmailChimp(email, username, gender, 1)
        req.flash("success", "تم التسجيل بنجاح ، يمكنك تسجيل الدخول الآن")
        res.redirect("/signIn")

    })

}


module.exports.renderToSignInPage = (req, res) => {
    res.render("users/signInPage");
}

module.exports.signInUser = (req, res) => {
    const redirectUrl = req.session.returnTo || '/myBag';
    delete req.session.returnTo;
    res.redirect(redirectUrl)

}


module.exports.logOutUser = (req, res) => {
    req.session.destroy();
    req.logout();
    res.redirect("/")
}


module.exports.renderToForgetPage = (req, res) => {
    res.render("users/forgot");
}


module.exports.sendNewPassowrd = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        req.flash("error", "إيميل غير مسجل");
        return res.redirect("/forgot");
    }
    let token = await Token.find({ userId: user.id })
    if (token) {
        await Token.deleteOne({ userId: user.id })
    }
    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, 10);
    await new Token({
        userId: user.id,
        token: hash,
        createdAt: Date.now()
    }).save()

    const link = `${req.headers.host}/reset/${resetToken}?id=${user._id}`;
    sendEmail(user.email, 'إعادة تعيين كلمة المرور', { link: link }, './templates/requestResetPassword.handlebars')
    console.log('mail sent');
    req.flash("success", "تم إرسال الرسالة الى بريدك، قد تجد الرسالة في قسم البريد الغير هام")
    return res.redirect('/forgot')
}



module.exports.renderToWriteNewPassword = async (req, res) => {
    let passwordResetToken = await Token.findOne({ userId: req.query.id })
    if (!passwordResetToken) {
        req.flash('error', 'كلمة المرور غير صالحة أو انتهت صلاحيتها');
        return res.redirect('/forgot');
    }
    const isValid = await bcrypt.compare(req.params.token, passwordResetToken.token);
    if (!isValid) {
        req.flash('error', 'كلمة المرور غير صالحة أو انتهت صلاحيتها');
        return res.redirect('/forgot');
    }
    res.render('users/reset', { token: req.params.token, userId: passwordResetToken.userId })
}



module.exports.createNewPassword = async (req, res) => {
    const userId = req.query.id
    const password = req.body.password
    if (!password === req.body.confirm) {
        req.flash("error", "كلمة المرور غير متطابقة");
        return res.redirect('back');
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.findById({ _id: userId })
    await User.updateOne(
        { _id: userId },
        { $set: { password: hash } },
        { new: true }
    )
    sendEmail(user.email, 'تم تغير كلمة المرور', { name: user.username }, './templates/resetSucceed.handlebars')
    await Token.deleteOne({ userId: userId })
    req.flash("success", "تم تغيير كلمة المرور");
    return res.redirect('/signIn')


}

