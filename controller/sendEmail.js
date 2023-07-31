const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require('fs');
const path = require('path');
const { error } = require("console");

const sendEmail = async (email, subject, payload, template) => {
    try {
        let transporter = nodemailer.createTransport({
            name: "www.samples10.com",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                type: "OAuth2",
                user: "info@samples10.com",
                serviceClient: process.env.GOOGLECLIENTID,
                privateKey: process.env.GOOGLEPRIVATEKEY,
            },
        });
        const source = fs.readFileSync(path.join(__dirname, template), 'utf-8')
        const compiledTemplate = handlebars.compile(source);
        let options = {
            from: "info@samples10.com",
            to: email,
            subject: subject,
            html: compiledTemplate(payload)
        };

        // send Email
        await transporter.sendMail(options, (error, info) => {
            if (error) {
                return error
            } else {
                return res.status(200).json({
                    success: true,
                });
            }
        });

    } catch {
        return error
    }
};

module.exports = sendEmail;