const User = require("../models/user");
const convert = require('xml-js');
const mailChimp = require('./mailChimp');



module.exports.renderToMyBagPage = (req, res) => {

    res.render("tests/myBag")
}
module.exports.renderToAllExams = (req, res) => {
    res.render("tests/trainingExamsPage");
}


module.exports.renderToInstructionPage = (req, res) => {
    res.render("tests/instructions")
}

module.exports.renderToExamOne = (req, res) => {
    const session = req.session
    session.userId = req.user.id
    res.render("tests/Exams/examOne/index");
}


module.exports.renderToExamTwo = (req, res) => {
    res.render("tests/Exams/examTwo/index");
}

module.exports.renderToExamThree = (req, res) => {
    res.render("tests/Exams/examThree/index");
}

module.exports.renderToExamFour = (req, res) => {
    res.render("tests/Exams/examFour/index");
}

module.exports.renderToExamFive = (req, res) => {
    res.render("tests/Exams/examFive/index");
}

module.exports.renderToExamSix = (req, res) => {
    res.render("tests/Exams/examSix/index");
}

module.exports.sendResultToMailchimp = (req, res) => {
    //quizReport contains all the variables -> checkout dbg.js
    const quizReport = req.body;
    //detailed report in xml format
    const detailedReportXml = req.body.dr;
    //converting xml to json using "xml-js" library functions
    quizReport.jsonDR = convert.xml2json(detailedReportXml, {
        compact: true,
    });

    var parse = JSON.parse(quizReport.jsonDR)
    var total = parseInt(parse['quizReport']['summary']['_attributes'].score)
    var time = parseInt(parse['quizReport']['summary']['_attributes'].time)
    var listening = parseInt(parse['quizReport']['groups']['group'][0]['_attributes'].awardedScore)
    var reading = parseInt(parse['quizReport']['groups']['group'][1]['_attributes'].awardedScore)
    var grammar = parseInt(parse['quizReport']['groups']['group'][2]['_attributes'].awardedScore)

    try {
        mailChimp.saveExamResult(req.user.email, req.user.username, time, total, listening, reading, grammar)
        res.status(200).send('done')
    } catch (error) {
        console.log("catch error", error)
        res.status(400).send('email is not correct');
    }

}