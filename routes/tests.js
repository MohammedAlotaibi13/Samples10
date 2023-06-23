const express = require("express");
const router = express.Router();
const User = require("../models/user");
const middleware = require("../middleware/index")
const courses = require('../controller/course')
const exams = require('../controller/exam')
const quizzes = require('../controller/quiz')



// index




router.get("/myBag", middleware.isLoggedIn, exams.renderToMyBagPage);


//  quizzes 

router.get("/Quizzes/:id", middleware.isLoggedIn, quizzes.renderToQuizzesPage);

router.get("/listening/:id", middleware.isLoggedIn, quizzes.renderToListeningQuizzes);

router.get("/reading/:id", middleware.isLoggedIn, quizzes.renderToReadingQuizzes);

router.get("/writing/:id", middleware.isLoggedIn, quizzes.renderToWritingQuizzes);

router.get("/grammar/:id", middleware.isLoggedIn, quizzes.renderToGrammarQuizzes);

router.get("/listening/quizOne/:id", middleware.isLoggedIn, middleware.isGoldMember, quizzes.renderToListeningQuizeOne);

router.get("/listening/quizTwo/:id", middleware.isLoggedIn, middleware.isGoldMember, quizzes.renderToListeningQuizTwo);

router.get("/listening/quizThree/:id", middleware.isLoggedIn, middleware.isGoldMember, quizzes.renderToListeningQuizThree);

router.get("/reading/quizOne/:id", middleware.isLoggedIn, middleware.isGoldMember, quizzes.renderToReadingQuizOne);

router.get("/reading/quizTwo/:id", middleware.isLoggedIn, middleware.isGoldMember, quizzes.renderToReadingQuizTwo);

router.get("/reading/quizThree/:id", middleware.isLoggedIn, middleware.isGoldMember, quizzes.renderToReadingQuizThree);


router.get("/grammar/quizOne/:id", middleware.isLoggedIn, middleware.isGoldMember, quizzes.renderToGrammarQuizOne);


router.get("/grammar/quizTwo/:id", middleware.isLoggedIn, middleware.isGoldMember, quizzes.renderToGrammarQuizTwo);


router.get("/grammar/quizThree/:id", middleware.isLoggedIn, middleware.isGoldMember, quizzes.renderToGrammarQuizThree);


router.get("/writing/quizOne/:id", middleware.isLoggedIn, middleware.isGoldMember, quizzes.renderToWritingQuizOne);


router.get("/writing/quizTwo/:id", middleware.isLoggedIn, middleware.isGoldMember, quizzes.renderToWritingQuizTwo);


router.get("/writing/quizThree/:id", middleware.isLoggedIn, middleware.isGoldMember, quizzes.renderToWritingQuizThree);

// exams Page
router.get("/trainingExamsPage/:id", middleware.isLoggedIn, exams.renderToAllExams);

router.get("/Exam/examOne/:id", middleware.isLoggedIn, middleware.isFreeMember, exams.renderToExamOne);
router.post("/quizReport", exams.sendResultToMailchimp);


router.get("/Exam/examTwo/:id", middleware.isLoggedIn, middleware.isProMember, exams.renderToExamTwo);

router.get("/Exam/examThree/:id", middleware.isLoggedIn, middleware.isProMember, exams.renderToExamThree);

router.get("/Exam/examFour/:id", middleware.isLoggedIn, middleware.isProMember, exams.renderToExamFour);

router.get("/Exam/examFive/:id", middleware.isLoggedIn, middleware.isProMember, exams.renderToExamFive);

router.get("/Exam/examSix/:id", middleware.isLoggedIn, middleware.isProMember, exams.renderToExamSix);

//course 
router.get('/courseDetailes', courses.renderCourseDetailes)
router.get("/courseOne/:id", middleware.isLoggedIn, middleware.isFreeMember, courses.renderTofreeCourse)

router.get("/courseTwo/:id", middleware.isLoggedIn, middleware.isGoldMember, courses.renderToPaidCourse)



module.exports = router;