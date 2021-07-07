var User = require("../models/user");

module.exports.renderToQuizzesPage = (req, res) => {

    res.render("tests/Quizzes");
}

module.exports.renderToListeningQuizzes = (req, res) => {
    res.render("tests/listening");
}

module.exports.renderToReadingQuizzes = (req, res) => {
    res.render("tests/reading");
}

module.exports.renderToWritingQuizzes = (req, res) => {
    res.render("tests/writing");
}

module.exports.renderToGrammarQuizzes = (req, res) => {
    res.render("tests/grammar");
}

module.exports.renderToListeningQuizeOne = (req, res) => {
    res.render("tests/Quizzes/listening/quizOne/index");
}



module.exports.renderToListeningQuizTwo = (req, res) => {
    res.render("tests/Quizzes/listening/quizTwo/index");
}

module.exports.renderToListeningQuizThree = (req, res) => {
    res.render("tests/Quizzes/listening/quizThree/index");
}

module.exports.renderToReadingQuizOne = (req, res) => {
    res.render("tests/Quizzes/reading/quizOne/index");
}


module.exports.renderToReadingQuizTwo = (req, res) => {
    res.render("tests/Quizzes/reading/quizTwo/index");
}

module.exports.renderToReadingQuizThree = (req, res) => {
    res.render("tests/Quizzes/reading/quizThree/index");
}

module.exports.renderToGrammarQuizOne = (req, res) => {
    res.render("tests/Quizzes/grammar/quizOne/index");
}

module.exports.renderToGrammarQuizTwo = (req, res) => {
    res.render("tests/Quizzes/grammar/quizTwo/index");
}

module.exports.renderToGrammarQuizThree = (req, res) => {
    res.render("tests/Quizzes/grammar/quizThree/index");
}

module.exports.renderToWritingQuizOne = (req, res) => {
    res.render("tests/Quizzes/writing/quizOne/index");
}

module.exports.renderToWritingQuizTwo = (req, res) => {
    res.render("tests/Quizzes/writing/quizTwo/index");
}


module.exports.renderToWritingQuizThree = (req, res) => {
    res.render("tests/Quizzes/writing/quizThree/index");
}