var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var secret = require('../config/dbconfig').secret;
var UserSchema = new mongoose.Schema({
    username:{
        type: String,
        unique:true,
        index:true,
    },
    mobile: {
        type: String,
        unique: true,
        index: true,
        match: [/\d{9}$/, 'is invalid']
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true,
    },

    password: {
        type: String,
        require: true,
    },
    active: {
        type: Boolean,
        default: false,
    },
    admin: {
        type: Boolean,
        default: false,
        },
}, { timestamps: true });

UserSchema.pre('save', function (next) {
    var user = this;

    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                //console.log('encrypted user password-> ' + user.password);
                next();
            });
        })
    }
    else {
        return next();
    }
})
UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        return cb(null, isMatch);
    })
}

module.exports = mongoose.model('User', UserSchema)
