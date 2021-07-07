var express = require("express");
var router = express.Router();
var User = require("../models/user");
var middleware = require("../middleware/index")
const courses = require('../controller/course')
const exams = require('../controller/exam')
const quizzes = require('../controller/quiz')



// index

router.get("/instruction/:id", middleware.isLoggedIn, middleware.isFreeMember, exams.renderToInstructionPage)



router.get("/myBag", middleware.isLoggedIn, exams.renderToMyBagPage);


//  quizzes 

router.get("/Quizzes/:id", middleware.isLoggedIn, middleware.isProMember, quizzes.renderToQuizzesPage);

router.get("/listening/:id", middleware.isLoggedIn, middleware.isProMember, quizzes.renderToListeningQuizzes);

router.get("/reading/:id", middleware.isLoggedIn, middleware.isProMember, quizzes.renderToReadingQuizzes);

router.get("/writing/:id", middleware.isLoggedIn, middleware.isProMember, quizzes.renderToWritingQuizzes);

router.get("/grammar/:id", middleware.isLoggedIn, middleware.isProMember, quizzes.renderToGrammarQuizzes);

router.get("/listening/quizOne/:id", middleware.isLoggedIn, middleware.isProMember, quizzes.renderToListeningQuizeOne);

router.get("/listening/quizTwo/:id", middleware.isLoggedIn, middleware.isProMember, quizzes.renderToListeningQuizTwo);

router.get("/listening/quizThree/:id", middleware.isLoggedIn, middleware.isProMember, quizzes.renderToListeningQuizThree);

router.get("/reading/quizOne/:id", middleware.isLoggedIn, middleware.isProMember, quizzes.renderToReadingQuizOne);

router.get("/reading/quizTwo/:id", middleware.isLoggedIn, middleware.isProMember, quizzes.renderToReadingQuizTwo);

router.get("/reading/quizThree/:id", middleware.isLoggedIn, middleware.isProMember, quizzes.renderToReadingQuizThree);


router.get("/grammar/quizOne/:id", middleware.isLoggedIn, middleware.isProMember, quizzes.renderToGrammarQuizOne);


router.get("/grammar/quizTwo/:id", middleware.isLoggedIn, middleware.isProMember, quizzes.renderToGrammarQuizTwo);


router.get("/grammar/quizThree/:id", middleware.isLoggedIn, middleware.isProMember, quizzes.renderToGrammarQuizThree);


router.get("/writing/quizOne/:id", middleware.isLoggedIn, middleware.isProMember, quizzes.renderToWritingQuizOne);


router.get("/writing/quizTwo/:id", middleware.isLoggedIn, middleware.isProMember, quizzes.renderToWritingQuizTwo);


router.get("/writing/quizThree/:id", middleware.isLoggedIn, middleware.isProMember, quizzes.renderToWritingQuizThree);

// exams Page
router.get("/trainingExamsPage/:id", middleware.isLoggedIn, middleware.isGoldMember, exams.renderToAllExams);

router.get("/Exam/examOne/:id", middleware.isLoggedIn, middleware.isFreeMember, exams.renderToExamOne);

router.get("/Exam/examTwo/:id", middleware.isLoggedIn, middleware.isGoldMember, exams.renderToExamTwo);

router.get("/Exam/examThree/:id", middleware.isLoggedIn, middleware.isGoldMember, exams.renderToExamThree);

router.get("/Exam/examFour/:id", middleware.isLoggedIn, middleware.isGoldMember, exams.renderToExamFour);

router.get("/Exam/examFive/:id", middleware.isLoggedIn, middleware.isGoldMember, exams.renderToExamFive);

router.get("/Exam/examSix/:id", middleware.isLoggedIn, middleware.isGoldMember, exams.renderToExamSix);

//course 

router.get("/courseOne/:id", middleware.isLoggedIn, middleware.isFreeMember, courses.renderTofreeCourse)

router.get("/courseTwo/:id", middleware.isLoggedIn, middleware.isProMember, courses.renderToPaidCourse)



module.exports = router;