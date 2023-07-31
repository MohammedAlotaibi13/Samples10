var mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;



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
        default: Date.now() + 86400000 // 24 hours
    },
    numberOfAttempts: {
        type: Number,
        default: 2
    },
    payments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"
    }],
    welcomeCoupon: {
        type: String,
        default: 'Samples10'
    },
    welcomeCouponExpiration: {
        type: Date,
        default: Date.now() + 86400000 // 24 hours
    },

});


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    const hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;
    next()
})



module.exports = mongoose.model("User", userSchema);