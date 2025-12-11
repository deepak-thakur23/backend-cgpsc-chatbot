var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var secret = require('../config/dbconfig').secret;
var UserSchema = new mongoose.Schema({
    img:
    {
        type: String,
        //default: "images/avatar/avatar_profile.png"
    },

    mobile: {
        type: String,
        unique: true,
        index: true,
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
    resetLink: {
        data: String,
        default: "",
    }

}, { timestamps: true });

UserSchema.pre("save", function (next) {
    const user = this
    console.log(`mobile-:${user.mobile}`)
    user.img = 'images/avatar/profilePic_' + user.mobile + '.jpg'
    if (this.isModified("password") || this.isNew) {
        bcrypt.genSalt(10, function (saltError, salt) {
            if (saltError) {
                return next(saltError)
            } else {
                bcrypt.hash(user.password, salt, function (hashError, hash) {
                    if (hashError) {
                        return next(hashError)
                    }

                    user.password = hash
                    next()
                })
            }
        })
    } else {
        return next()
    }
})
UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err)
            return cb(err);
        else
            return cb(null, isMatch);

    })
}
UserSchema.methods.pwdtohash = function (passw, cb) {
    try {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                console.log('genSalt error')
                return cb(err, null);
            }
            bcrypt.hash(passw, salt, function (err, hash) {
                if (err) {
                    console.log('hash error')
                    return cb(err, null);
                }
                passw = hash;
                return cb(null, passw);
            });
        })
    } catch (error) {
        return cb(error, null);
    }
}


module.exports = mongoose.model('AppUser', UserSchema)
