var mongoose = require("mongoose");

var testSchema = new mongoose.Schema({
	testName: String,
	totalResult: Number,
	listening: Number , 
	reading:   Number , 
	grammarAndWriting: Number
})

module.exports = mongoose.model( "Test" , testSchema)