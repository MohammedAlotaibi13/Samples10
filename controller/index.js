const User = require("../models/user");
const nodemailer = require("nodemailer")
const path = require('path');



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
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        name: "www.samples10.com",
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            type: "OAuth2",
            user: "info@samples10.com",
            serviceClient: process.env.GOOGLECLIENTID,
            privateKey: process.env.GOOGLEPRIVATEKEY,
        },
        // this only for localhost 
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"nodemailer Contact" <info@samples10.com', // sender address
        to: 'info@samples10.com', // list of receivers
        subject: 'Node testing', // Subject line
        text: 'Hello world?', // plain text body
        html: '<h3>From : </h3>' + req.body.email + '<h3>Subject: </h3>' + req.body.subject +
            '<h3> message:</h3>' + req.body.message // html body
    };

    // send mail with defined transport object
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        req.flash("success", "تم ارسال رسالتكم وسوف نوافيكم في أقرب وقت")
        res.redirect("/message");
    });
}