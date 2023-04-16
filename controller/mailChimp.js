const mailchimp = require("@mailchimp/mailchimp_marketing");
const md5 = require('md5');

mailchimp.setConfig({
    apiKey: process.env.MAILCHIMPAPI,
    server: 'us19'
});

module.exports.saveUserInmailChimp = async function (email, username, gender, numberOfAttempt) {
    const response = await mailchimp.lists.setListMember('5080ca4d5f', md5(email.toLowerCase()), {
        email_address: email,
        status_if_new: 'subscribed',
        merge_fields: {
            UNAME: username,
            GENDER: gender,
            ATTEMPT: numberOfAttempt
        }
    })
}


module.exports.savePaymentMailchimp = async function (email, userName, memberShip, paymentStatus, price) {
    const response = await mailchimp.lists.setListMember('fec4fb2783', md5(email.toLowerCase()), {
        email_address: email,
        status_if_new: 'subscribed',
        merge_fields: {
            UNAME: userName,
            MEMBERSHIP: memberShip,
            PAYMENTSTA: paymentStatus,
            PRICE: price

        }
    });
}

module.exports.saveCheckOut = async function (email, userName, memberShip, purchaseTime, gender, price) {
    const response = await mailchimp.lists.setListMember('b24419d2b5', md5(email.toLowerCase()), {
        email_address: email,
        status_if_new: 'subscribed',
        merge_fields: {
            UNAME: userName,
            MEMBERSHIP: memberShip,
            BUYTIME: purchaseTime,
            GENDER: gender,
            PRICE: price

        }
    });
}

module.exports.saveExamResult = async function (email, userName, timeSpent, totalScore, listening, reading, grammar) {
    const response = await mailchimp.lists.setListMember('721e7820e4', md5(email.toLowerCase()), {
        email_address: email,
        status_if_new: 'subscribed',
        merge_fields: {
            TIMESPENT: timeSpent,
            TOTALSCORE: totalScore,
            LISTENING: listening,
            READING: reading,
            GRAMMAR: grammar,
            USERNAME: userName

        }
    })

}

