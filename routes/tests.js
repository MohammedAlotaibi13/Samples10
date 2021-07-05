var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Test = require("../models/test");
var middleware = require("../middleware/index")
const courses = require('../controller/course')
const exams = require('../controller/exam')
const quizzes = require('../controller/quiz')

// index

router.get("/instruction/:username", middleware.isLoggedIn, exams.renderToInstructionPage)

router.get("/test", middleware.isLoggedIn, function (req, res) {
    res.render("tests/testPage")
})

router.get("/myBag", middleware.isLoggedIn, exams.renderToMyBagPage);


//  quizzes 

router.get("/Quizzes/:username", middleware.isLoggedIn, quizzes.renderToQuizzesPage);

router.get("/listening/:username", middleware.isLoggedIn, quizzes.renderToListeningQuizzes);

router.get("/reading/:username", middleware.isLoggedIn, quizzes.renderToReadingQuizzes);

router.get("/writing/:username", middleware.isLoggedIn, quizzes.renderToWritingQuizzes);

router.get("/grammar/:username", middleware.isLoggedIn, quizzes.renderToGrammarQuizzes);

router.get("/listening/quizOne/:username", middleware.isLoggedIn, quizzes.renderToListeningQuizeOne);

router.get("/listening/quizTwo/:username", middleware.isLoggedIn, quizzes.renderToListeningQuizTwo);

router.get("/listening/quizThree/:username", middleware.isLoggedIn, quizzes.renderToListeningQuizThree);

router.get("/reading/quizOne/:username", middleware.isLoggedIn, quizzes.renderToReadingQuizOne);

router.get("/reading/quizTwo/:username", middleware.isLoggedIn, quizzes.renderToReadingQuizTwo);

router.get("/reading/quizThree/:username", middleware.isLoggedIn, quizzes.renderToReadingQuizThree);


router.get("/grammar/quizOne/:username", middleware.isLoggedIn, quizzes.renderToGrammarQuizOne);


router.get("/grammar/quizTwo/:username", middleware.isLoggedIn, quizzes.renderToGrammarQuizTwo);


router.get("/grammar/quizThree/:username", middleware.isLoggedIn, quizzes.renderToGrammarQuizThree);


router.get("/writing/quizOne/:username", middleware.isLoggedIn, quizzes.renderToWritingQuizOne);


router.get("/writing/quizTwo/:username", middleware.isLoggedIn, quizzes.renderToWritingQuizTwo);


router.get("/writing/quizThree/:username", middleware.isLoggedIn, quizzes.renderToWritingQuizThree);

// exams Page
router.get("/trainingExamsPage/:username", middleware.isLoggedIn, exams.renderToAllExams);

router.get("/Exam/examOne/:username", middleware.isLoggedIn, exams.renderToExamOne);

router.get("/Exam/examTwo/:username", middleware.isLoggedIn, exams.renderToExamTwo);

router.get("/Exam/examThree/:username", middleware.isLoggedIn, exams.renderToExamThree);

router.get("/Exam/examFour/:username", middleware.isLoggedIn, exams.renderToExamFour);

router.get("/Exam/examFive/:username", middleware.isLoggedIn, exams.renderToExamFive);

router.get("/Exam/examSix/:username", middleware.isLoggedIn, exams.renderToExamSix);

//course 

router.get("/courseOne/:username", middleware.isLoggedIn, courses.renderTofreeCourse)

router.get("/courseTwo/:username", middleware.isLoggedIn, courses.renderToPaidCourse)



module.exports = router;