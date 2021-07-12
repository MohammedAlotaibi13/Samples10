const querystring = require('querystring')
const https = require('https');
const axios = require('axios');

module.exports.generateCheckoutId = (obj) => {

    var path = '/v1/checkouts';
    var data = querystring.stringify({
        'entityId': process.env.ENTITYID,
        'amount': obj.amount,
        'currency': "SAR",
        'paymentType': 'DB',
        'merchantTransactionId': obj.merchantTransactionId,
        'customer.email': obj.email,
        'billing.street1': 'street',
        'billing.city': 'Riyadh',
        'billing.state': 'Riyadh',
        'billing.postcode': '11564',
        'customer.givenName': 'name',
        'customer.surname': 'name',
        'billing.country': 'SA',

    });
    var options = {
        port: 443,
        host: 'oppwa.com',
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length,
            'Authorization': process.env.AUTHORIZATIONTOKE
        }
    };
    var postRequest = https.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            jsonRes = JSON.parse(chunk);
            return obj.cb(jsonRes);
        });
    });
    postRequest.write(data);
    postRequest.end();
}

module.exports.resultRequest = (resourcePath, callback) => {
    var path = resourcePath;
    path += '?entityId=' + process.env.ENTITYID

    const url = `https://oppwa.com${path}`;

    axios
        .get(url, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: process.env.AUTHORIZATIONTOKE,
            },
        })
        .then(function (response) {
            // handle success

            try {
                resDate = JSON.parse(response);
            } catch (e) {
                resData = response;
                console.log(resData.data.id);
            }

            return callback(resData.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}