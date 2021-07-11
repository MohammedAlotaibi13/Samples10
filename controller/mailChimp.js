const request = require("request")

module.exports.saveUserInmailChimp = function (email, username, gender) {
    const data = {
        members: [{
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                UNAME: username,
                GENDER: gender
            }
        }]
    }
    const postData = JSON.stringify(data)
    const option = {
        url: "https://us19.api.mailchimp.com/3.0/lists/5080ca4d5f",
        method: 'POST',
        headers: {
            Authorization: process.env.MAILCHIMPAPI
        },
        body: postData
    }

    request(option, (err, response, body) => {
        if (err) {
            console.log(err)
        } else {
            if (response.statusCode == 200) {
                console.log("done")
            } else {
                console.log(response.statusCode)
            }
        }
    })
}