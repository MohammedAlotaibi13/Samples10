var express = require("express");
var router  = express.Router();
var nodemailer = require("nodemailer")
var User    = require("../models/user");
var middleware = require("../middleware/index")


router.get("/" , function(req ,res){
    
	res.render("landingPage");
})

router.get("/about" , function(req , res){
   res.render("whoWeAre");
});

router.get("/pay", middleware.isLoggedIn , function(req , res){
   res.render("payPage");
});

router.get("/blog" , function(req , res){
  res.render("blog")
})

router.get("/app" , function(req , res){
  res.render("app")
})


router.get("/profile/:id", middleware.isLoggedIn , function(req , res){
   User.findById(req.params.id , function(error , foundUser){
      if(error){
        console.log(error)
        res.redirect("back")
      } else {
        res.render("profilePage" , {foundUser : foundUser})
      }
   });
});

router.delete("/profile/:id", middleware.isLoggedIn , function(req , res){
  User.findByIdAndRemove(req.params.id , function(error , foundUser){
     if(error){
       console.log(error);
       res.redirect("back")
     } else {
       console.log("user deleted")
       res.redirect("/")
     }
  });
});


router.get("/message" , function(req , res){
    res.render("sendToUs");
});

router.post("/send" , function(req , res){  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'info@samples10.com', // generated ethereal user
            pass:  "" // generated ethereal password
        } , 
        // this only for localhost 
        tls: {
          rejectUnauthorized: false
        }
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
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        req.flash("success" , "تم ارسال رسالتكم وسوف نوافيكم في أقرب وقت")
        res.redirect("/message");
    });
});

module.exports = router ; 