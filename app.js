var express        = require("express"),
     app           = express(),
 bodyParser        = require("body-parser"),
   mongoose        = require("mongoose"),
   passport        = require("passport"),
   flash           = require("connect-flash"),
   methodOverride  = require("method-override"),
  localStrategy    = require("passport-local");

app.set("view engine" , "ejs");

app.get("/" , function(req , res){
	res.render("landingPage")
})

app.listen(3000, process.env.IP , function(){
   console.log("Server is starting");
});


