var mongoose = require("mongoose");

var testIdSchema = new mongoose.Schema({
	testNumber: Number 
})


module.exports = mongoose.model( "TestId" , testIdSchema)