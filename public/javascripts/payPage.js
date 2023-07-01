function isChecked() {
    var terms = document.getElementById("terms").checked;
    if (terms == false) {
        alert("الرجاء الموافقة على الشروط والأحكام")
        return false
    }
}



var a = document.getElementById('memberShipPicker');
var total = document.getElementById("total");

a.addEventListener('change', function () {
    if (this.value == "Gold") {
        total.value = "199"
    } else {
        total.value = "165"
    }
}, false);

var couponInput = document.getElementById('couponInput');

couponInput.addEventListener('change', function () {
    if (this.value == "" && a.value == "Gold") {
        total.value = "199"
    } else if (this.value == "" && a.value == "Pro") {
        total.value = "165"
    }
}, false)

var welcomeCouponExpiration = document.getElementById('welcomeCouponExpiration');
var abandonedCouponExpiration = document.getElementById('abandonedCouponExpiration');

function applyCoupon() {
    applyWelcomeCoupon()
}



function applyWelcomeCoupon() {
    var welcomeCouponExpirationInMiliesecond = Date.parse(welcomeCouponExpiration.value)

    if (couponInput.value == 'Samples10' && Date.now() < welcomeCouponExpirationInMiliesecond) {
        if (total.value == "199") {
            total.value = "179"
        } else if (total.value == "165") {
            total.value = "148"
        }
    } else {
        alert('رمز خاطئ أو منتهي الصلاحية')
    }
}

function applyAbandendCartCoupon() {
    var abandonedCartCouponExpirationInMilesecond = Date.parse(abandonedCouponExpiration.value)
    var welcomeCouponExpirationInMiliesecond = Date.parse(welcomeCouponExpiration.value)

    if (couponInput.value == 'Samples15' && Date.now() < abandonedCartCouponExpirationInMilesecond) {
        if (total.value == "199") {
            total.value = "169"
        } else if (total.value == "165") {
            total.value = "140"
        }
    } else if (couponInput.value == 'Samples10' && Date.now() < welcomeCouponExpirationInMiliesecond) {
        if (total.value == "199") {
            total.value = "179"
        } else if (total.value == "165") {
            total.value = "148"
        }

    } else if (couponInput.value == 'Saudi23') {
        if (total.value == '199') {
            total.value = '139'
        } else if (total.value == '165') {
            total.value = '115'
        } else {
            alert('حدث خطأ حاول مجدداً')
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


