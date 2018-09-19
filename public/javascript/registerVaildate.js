var email = document.getElementById("mail");
var password = document.getElementById("password");
var confirm = document.getElementById("confirm");

email.addEventListener("input" , function(event){
  if(email.validity.typeMismatch){
  	email.setCustomValidity("الزجاء كتابة إيميل صالح");
  } else {
  	email.setCustomValidity("");
  }
});

password.addEventListener("input" , function(event){
   if(password.validity.typeMismatch) {
   	password.setCustomValidity("كلمة المرور قصيرة جداً")
   } else {
   	password.setCustomValidity("");
   }
});


confirm.addEventListener("input" , function(event){
	if(password !=== confirm){
		confirm.setCustomValidity("كلمة المرور لاتتطابث")
	} else {
		confirm.setCustomValidity("")
	}
})