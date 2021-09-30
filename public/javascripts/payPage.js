function isChecked() {
    var terms = document.getElementById("terms").checked;
    if (terms == false) {
        alert("الرجاء الموافقة على الشروط والأحكام")
        return false
    } else {
        return true;
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


