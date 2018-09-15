var express = require("express");
var router  = express.Router();
var User    = require("../models/user");
var Test    = require("../models/test");
var middleware = require("../middleware/index")
const forge = require('node-forge');


router.get("/result/:testName/test/:id", middleware.isLoggedIn ,function(req , res){
   Test.findOne({ testTaker:  req.params.id , testName: req.params.testName} , function(error , userInfo){
           if(error){
             console.log(error)
            } else {
               res.render("tests/resultPage" , {resultInfo: userInfo})         
           }
    })
});

router.get("/instruction/:username" ,function(req, res){
  User.findOne({username: req.params.username ,  accountExpiration:  { $gt: Date.now()} , numberOfAttempts: { $gt: 0 }}  , function(error , userInfo ){
    if(!userInfo){
      req.flash("error" , "انتهت عضوية الحساب او استنفذت عدد محاولات الأختبار  ")
       res.redirect("/test")
    } else {
      if(error){
        console.log(error)
      } else {
        console.log(userInfo)
      res.render("tests/instructions" , {userInfo: userInfo})
      }
    }
  })
})

router.get("/test" , middleware.isLoggedIn  ,function(req , res){
   // User.findOne({username: req.params.username , accountExpiration:  { $gt: Date.now()}, numberOfAttempts: { $gt: 0} } , function(error , userInfo){
   //  if(!userInfo){
   //    req.flash("error" , "انتهت عضوية الحساب او استنفذت عدد محاولات الأختبار  ")
   //    res.redirect("/")
   //  } else {
   //  if(error){
   //    console.log(error)
   //  } else {
   //     res.render("tests/testPage" , {userInfo: userInfo})
   //     }
   //   }
   // })
   res.render("tests/testPage")
 })

router.get("/testOne/:username" , middleware.isLoggedIn , function(req , res){  
   res.render("tests/testOne");
});

router.get("/testTwo/:username" , middleware.isLoggedIn , function(req , res){
    User.findOne({username: req.params.username ,  accountExpiration:  { $gt: Date.now()} , numberOfAttempts: { $gt: 0 }} , function(error , userInfo ){
    if(!userInfo){
      req.flash("error" , "انتهت عضوية الحساب او استنفذت عدد محاولات الأختبار  ")
       res.redirect("/test")
    } else {
      if(error){
        console.log(error)
      } else {
         res.render("tests/testTwo");
      }
    }
  })
});

router.get("/testThree/:username" , middleware.isLoggedIn , function(req , res){
   User.findOne({username: req.params.username ,  accountExpiration:  { $gt: Date.now()} , numberOfAttempts: { $gt: 0 }} , function(error , userInfo ){
    if(!userInfo){
      req.flash("error" , "انتهت عضوية الحساب او استنفذت عدد محاولات الأختبار  ")
       res.redirect("/test")
    } else {
      if(error){
        console.log(error)
      } else {
         res.render("tests/testThree");
      }
    }
  })
});

router.get("/testFour/:username" , middleware.isLoggedIn , function(req , res){
   User.findOne({username: req.params.username ,  accountExpiration:  { $gt: Date.now()} , numberOfAttempts: { $gt: 0 }} , function(error , userInfo ){
    if(!userInfo){
      req.flash("error" , "انتهت عضوية الحساب او استنفذت عدد محاولات الأختبار  ")
       res.redirect("/test")
    } else {
      if(error){
        console.log(error)
      } else {
       res.render("tests/testFour");
      }
    }
  })
});

router.get("/testFive/:username" , middleware.isLoggedIn , function(req , res){
  User.findOne({username: req.params.username ,  accountExpiration:  { $gt: Date.now()}} , function(error , userInfo ){
    if(!userInfo){
      req.flash("error" , "انتهت عضوية الحساب او استنفذت عدد محاولات الأختبار  ")
       res.redirect("/test")
    } else {
      if(error){
        console.log(error)
      } else {
       res.render("tests/testFive");
      }
    }
  })
});
// classmark code 
router.post('/result', function (req, res) {
    //  var headerHmacSignature = req.get("X-Classmarker-Hmac-Sha256");
      var jsonData = req.body;
    //  // You are given a uniquе sеcret code when crеating a Wеbhook.
    //  var secret = 'lG4NjRHhxAdbSwz';
    
    //  var verified = verifyData(jsonData,headerHmacSignature,secret);
    // //  console.log
    //  if(verified){
        //Savе rеsults in your databasе.
        
        var userId = jsonData["result"]["cm_user_id"]
        var testName = jsonData["test"]["test_name"]
        var testId    = jsonData["test"]["test_id"]
        var totalResult = jsonData["result"]["points_scored"]
        var listening = jsonData["category_results"][0]["points_scored"]
        var reading = jsonData["category_results"][1]["points_scored"]
        var grammar = jsonData["category_results"][2]["points_scored"]
        Test.find({testTaker: userId} , function(error , tests) {
          if (error) {
            console.log(error)
          } else {
             tests.forEach(function(test){
              if(test.testId == testId && test.testTaker == userId){
                Test.findOneAndRemove({testTaker: userId} , function(error , testRemove){
                  if(error){
                    console.log(error)
                  }else{
                    console.log("test removed")
                  }
                })
              }
             })
            Test.create({
              testName : testName,
              testId : testId,
              testTaker: userId,
              totalResult: totalResult,
              listening: listening , 
              reading: reading , 
              grammarAndWriting: grammar
            } , function(error , result){
              if(error){
                console.log("here error")
                console.log(error)
              } else {
                User.findById(userId , function(error , user){
                  if(error){
                    console.log("another error")
                    console.log(error)
                  } else {
                     user.numberOfAttempts -= 1
                     result.save()
                     user.tests.push(result)
                     user.save()
                     console.log(result)
                  }
                })
              }
            })
          }
        })
            
        res.sendStatus(200);
      
});

var verifyData = function(jsonData,headerHmacSignature, secret)
{
    var jsonHmac = computeHmac(jsonData, secret);
    return jsonHmac == headerHmacSignature;
};

var computeHmac = function(jsonData, secret){
    var hmac = forge.hmac.create();
    hmac.start('sha256', secret);
    var jsonString = JSON.stringify(jsonData);
    var jsonBytes = new Buffer(jsonString, 'ascii');
    hmac.update(jsonBytes);
    return forge.util.encode64(hmac.digest().bytes());
};

module.exports = router ; 