var express = require("express");
var app = express();


app.use(express.static(__dirname + "/public"));
app.set("view engine" , "ejs");

app.get("/" , function(req ,res){
	res.render("landingPage");
})

app.get("/register" , function(req , res){
   res.render("register");
});

app.get("/signIn" , function(req ,res){
	res.render("signInPage");
});

app.get("/message" , function(req , res){
    res.render("sendToUs");
});

app.get("/about" , function(req , res){
   res.render("whoWeAre");
});

app.get("/pay" , function(req , res){
   res.render("payPage");
});

app.get("/profile" , function(req , res){
   res.render("profilePage");
});

app.get("/result" , function(req , res){
  res.render("resultPage");
});

app.get("/test" , function(req , res){
  res.render("testPage");
});


app.listen(3000 , function(){
	console.log("app is starting");
});