var express = require("express");
var app = express();


app.use(express.static(__dirname + "/public"));

app.get("/" , function(req ,res){
	res.render("landingPage.ejs");
})

app.get("/register" , function(req , res){
   res.render("register.ejs");
});

app.get("/signIn" , function(req ,res){
	res.render("signInPage.ejs");
});

app.get("/message" , function(req , res){
    res.render("sendToUs.ejs");
});

app.get("/about" , function(req , res){
   res.render("whoWeAre.ejs");
});


app.listen(3000 , function(){
	console.log("app is starting");
});