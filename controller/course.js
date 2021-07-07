

module.exports.renderTofreeCourse = (req, res) => {
    res.render("tests/CourseFree/index");
}

module.exports.renderToPaidCourse = (req, res) => {
    res.render("tests/CoursePaid/index");
}