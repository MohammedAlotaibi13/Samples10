var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var bcrypt = require("bcrypt-nodejs");



var userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: String,
    gender: String,
    memberShip: {
        type: String,
        default: "free"
    },
    active: {
        type: Boolean,
        default: true
    },
    googleId: String,
    accountExpiration: {
        type: Date,
        required: true,
        default: Date.now() + 259200000 // three days
    },
    numberOfAttempts: {
        type: Number,
        default: 5
    },
    tests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test"
    }],
    payments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"
    }],
    resetPasswordToken: String,
    resetPasswordExpiration: Date,

});

userSchema.methods.hashPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

userSchema.methods.comparePassword = function (password, hash) {
    return bcrypt.compareSync(password, hash)
}

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);