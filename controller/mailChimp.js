const mailchimp = require("@mailchimp/mailchimp_marketing");
const md5 = require('md5');

mailchimp.setConfig({
    apiKey: process.env.MAILCHIMPAPI,
    server: 'us19'
});

module.exports.saveUserInmailChimp = async function (email, username, gender) {
    const response = await mailchimp.lists.setListMember('5080ca4d5f', md5(email.toLowerCase()), {
        email_address: email,
        status_if_new: 'subscribed',
        merge_fields: {
            UNAME: username,
            GENDER: gender
        }
    })
}


module.exports.savePaymentMailchimp = async function (email, userName, memberShip, paymentWay, paymentStatus) {
    const response = await mailchimp.lists.addListMember('fec4fb2783', {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
            UNAME: userName,
            MEMBERSHIP: memberShip,
            PAYMENTWAY: paymentWay,
            PAYMENTSTA: paymentStatus

        }
    });
}

