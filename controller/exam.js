const User = require("../models/user");

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