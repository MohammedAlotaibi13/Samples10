function isChecked() {
    var terms = document.getElementById("terms").checked;
    if (terms == false) {
        alert("الرجاء الموافقة على الشروط والأحكام")
        return false
    } else {
        return true;
    }
}



var a = document.getElementById('memberShipPicker');
var total = document.getElementById("total")

a.addEventListener('change', function () {
    if (this.value == "Gold") {
        total.value = "SR 199"
    } else {
        total.value = "SR 165"
    }
}, false);

var couponInput = document.getElementById('couponInput');

couponInput.addEventListener('change', function () {
    if (this.value == "" && a.value == "Gold") {
        total.value = "SR 199"
    } else if (this.value == "" && a.value == "Pro") {
        total.value = "SR 165"
    }
}, false)

var welcomeCouponExpiration = document.getElementById('welcomeCouponExpiration');
var abandonedCouponExpiration = document.getElementById('abandonedCouponExpiration');

function applyCoupon() {


    if (welcomeCouponExpiration && welcomeCouponExpiration.value) {
        applyWelcomeCoupon()

    } else {
        applyAbandendCartCoupon()
    }
}



function applyWelcomeCoupon() {
    var welcomeCouponExpirationInMiliesecond = Date.parse(welcomeCouponExpiration.value)

    if (couponInput.value == 'Welcome' && Date.now() < welcomeCouponExpirationInMiliesecond) {
        if (total.value == "SR 199") {
            total.value = "SR 179"
        } else if (total.value == "SR 165") {
            total.value = "SR 148"
        }
    } else {
        alert('رمز خاطئ أو منتهي الصلاحية')
    }
}

function applyAbandendCartCoupon() {
    var abandonedCartCouponExpirationInMilesecond = Date.parse(abandonedCouponExpiration.value)

    if (couponInput.value == 'abandonedCart' && Date.now() < abandonedCartCouponExpirationInMilesecond) {
        if (total.value == "SR 199") {
            total.value = "SR 169"
        } else {
            total.value = "SR 140"
        }
    } else {
        alert('رمز خاطئ أو منتهي الصلاحية')
    }
}

//Google Tag Manager 
(function (w, d, s, l, i) {
    w[l] = w[l] || []; w[l].push({
        'gtm.start':
            new Date().getTime(), event: 'gtm.js'
    }); var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
            'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-KZHK7WQ');
//End Google Tag Manager

//Global site tag (gtag.js) - Google Analytics 

window.dataLayer = window.dataLayer || [];

function gtag() {
    dataLayer.push(arguments);
}
gtag('js', new Date());

gtag('config', 'UA-119528477-3');


