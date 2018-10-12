var express = require("express");
var router  = express.Router();
var nodemailer = require("nodemailer")
var https       = require('https');
var querystring = require('querystring')
var User    = require("../models/user");
var Payment    = require("../models/payment");
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


function generateCheckoutId(obj){
  
  var path='/v1/checkouts';
  var data = querystring.stringify( {
    'authentication.userId' : '8a82941866529a2e016652ac34070027',
    'authentication.password' : 'BPJr2xBKaN',
    'authentication.entityId' : '8a82941866529a2e016652acc495002b',
    'amount' : obj.amount,
    'currency': "SAR",
    'paymentType' : 'DB',
    'merchantTransactionId' : obj.merchantTransactionId,
     'customer.email': 'email@email.com',
    'billing.street1': 'street',
    'billing.city': 'city',
    'billing.state': 'city',
    'billing.postcode': '123',
    'customer.givenName': 'name',
    'customer.surname': 'name',
    'billing.country': 'SA',
  });
  var options = {
    port: 443,
    host: 'test.oppwa.com',
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': data.length
    }
  };
  var postRequest = https.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      jsonRes = JSON.parse(chunk);
      return obj.cb(jsonRes);
    });
  });
  postRequest.write(data);
  postRequest.end();
}

router.get("/checkout/:id/:memberShip" , middleware.isLoggedIn , function(req , res){
  User.findById(req.params.id , function(error, foundUser){
    if(error){
      console.log(error)
      res.redirect("back")
    } else {
      Payment.create({
        memberShip: req.params.memberShip,
        timeOfPayment: Date.now(),
        status: "pending"
      } , function(error, paymentInfo){
        if(error){
          console.log(error)
          return res.redirect("back")
        } else {
          paymentInfo.save()
          foundUser.payments.push(paymentInfo)
          foundUser.save()
          console.log(paymentInfo)
        }
        generateCheckoutId({
        amount: '79.00',
        merchantTransactionId : paymentInfo.id,
        cb: (result) => {
        console.log(result)
        res.render("checkoutPage" , {checkoutId: result.id})
    },
   })
      })
    }
  })

})


function generateResult(resourcePath , callback) {
  var path=resourcePath
  path += '?authentication.userId=8a82941866529a2e016652ac34070027';
  path += '&authentication.password=BPJr2xBKaN';
  path += '&authentication.entityId=8a82941866529a2e016652acc495002b';
  var options = {
    port: 443,
    host: 'test.oppwa.com',
    path: path,
    method: 'GET',
  };
  var postRequest = https.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      jsonRes = JSON.parse(chunk);
      return callback(jsonRes);
    });
  });
  postRequest.end();
}


router.get("/paymentResult" , function(req , res){
  res.render("paymentStatus")
})

router.get("/success" , function(req , res){
  console.log(req.query);
  console.log(req.body);
  // Check checkout status
  generateResult(req.query.resourcePath, (response) => {
    console.log(response);
    // Check that result code match pattern from https://gate2play.docs.oppwa.com/reference/resultCodes
    console.log('response.merchantTransactionId', response.merchantTransactionId)
    if (response.result.code && /^(000\.000\.|000\.100\.1|000\.[36])/.test(response.result.code)) {
      // Create Payment instance here
      Payment.findById(response.merchantTransactionId , function(error , paymentInfo){
        paymentInfo.status = "successful"
        paymentInfo.save()
        console.log(paymentInfo)
      })
      req.flash("success" , " تم الدفع بنجاح")
      res.redirect("/paymentResult");
    } else {
      // For some reasons it was not success. Check response.result.code and match it with https://gate2play.docs.oppwa.com/reference/resultCodes
      req.flash("error" , response.result.description)
      res.redirect("/paymentResult")
    }
  });

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
            pass:  process.env.PASSWORD // generated ethereal password
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