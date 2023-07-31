const User = require("../models/user");
const sendEmail = require('./sendEmail');




module.exports.renderToLandingPage = (req, res) => {
    res.render("landingPage");
}

module.exports.renderToFaqPage = (req, res) => {
    res.render('FAQPage')
}

module.exports.renderToAboutPage = (req, res) => {
    res.render("whoWeAre");
}

module.exports.renderToTermsAndCondition = (req, res) => {
    res.render("termsAndCondition")
}

module.exports.renderToTestominalPage = (req, res) => {
    res.render("testominalPage")
}

module.exports.renderToBlogPage = (req, res) => {
    res.render("blog")
}

module.exports.renderToAppPage = (req, res) => {
    res.render("app")
}

module.exports.renderToProfilePage = async (req, res) => {
    await User.findById(req.params.id, function (error, foundUser) {
        if (error) {
            console.log(error)
            res.redirect("back")
        } else {
            res.render("profilePage", {
                foundUser: foundUser
            })
        }
    });
}

module.exports.deleteAccount = async (req, res) => {
    await User.findByIdAndRemove(req.params.id, function (error, foundUser) {
        if (error) {
            console.log(error);
            res.redirect("back")
        } else {
            console.log("user deleted")
            res.redirect("/")
        }
    });
}


module.exports.renderToMessagePage = (req, res) => {
    res.render("sendToUs");
}

module.exports.sendMessage = async (req, res) => {
    sendEmail('info@samples10.com', 'Message from Website', { email: req.body.email, subject: req.body.subject, message: req.body.message }, './templates/sendToUs.handlebars')
    req.flash("success", "تم ارسال رسالتكم وسوف نوافيكم في أقرب وقت")
    res.redirect("/message");
};
