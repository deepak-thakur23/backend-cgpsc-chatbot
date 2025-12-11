var mongoose = require('mongoose');
var UserProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z ]+$/, 'is invalid'],
    },
    dob: {
        type: String,
        required: true,
    },

    gender: {
        type: String,
        required: true,
    },
    // qulification

    ssc: {
        type: String,
    },
    hsc: {
        type: String,
    },

    gradOn: {
        type: String,
    },
    // graduateSub: {
    //     type: String,
    // },

    pgOn: {
        type: String,
    },
    // pgSub: {
    //     type: String,
    // },
    // experience
    acadExp: {
        type: String,
    },
    techExp: {
        type: String,
    },
    otherExp: {
        type: String,
    },

}, { timestamps: true });

module.exports = mongoose.model('Profile', UserProfileSchema)
