var express = require("express");
var router  = express.Router();
var User    = require("../models/user");
var Test    = require("../models/test");
var middleware = require("../middleware/index")


router.get("/result/:testName/test/:id", middleware.isLoggedIn ,function(req , res){
   Test.findOne({ testTaker:  req.params.id , testName: req.params.testName} , function(error , userInfo){
           if(error){
             console.log(error)
            } else {
               res.render("tests/resultPage" , {resultInfo: userInfo})         
           }
    })
});


router.get("/test/:id" , middleware.isLoggedIn  ,function(req , res){
   User.findById( req.params.id , function(error , userInfo){
    if(error){
      req.flash("error" , "end")
      res.redirect("/")
    } else {
    if(error){
      console.log(error)
    } else {
       res.render("tests/testPage" , {userInfo: userInfo})
       }
     }
   })
 })

router.get("/testOne/:id" , middleware.isLoggedIn , function(req , res){
   console.log(req.params.id)
   res.render("tests/testOne");
});

router.get("/testTwo/:id" , function(req , res){
   console.log(req.params.id)
   res.render("tests/testTwo");
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
        // Savе rеsults in your databasе.
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
                console.log(error)
              } else {
                User.findById(userId , function(error , user){
                  if(error){
                    console.log(error)
                  } else {
                     result.save()
                     user.tests.push(result)
                     user.save()
                  }
                })
               
              }
            })
          }
        })
            
        res.sendStatus(200);
});

module.exports = router ; 