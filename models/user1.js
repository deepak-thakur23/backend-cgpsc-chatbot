// var mongoose = require('mongoose');
// //var uniqueValidator = require('mongoose-unique-validator');
// var bcrypt = require('bcrypt');
// //var crypto = require('crypto');
// // var jwt = require('jsonwebtoken');
// // var secret = require('../config/dbconfig').secret;
// var UserSchema = new mongoose.Schema({
//     // username: {
//     //     type: String,
//     //     lowercase: true,
//     //     unique: true,
//     //     required: [true, "can't be blank"],
//     //     match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
//     //     index: true
//     // },
//     mobile: {
//         type: String,
//         unique: true,
//         index: true,
//     },
//     email: {
//         type: String,
//         lowercase: true,
//         unique: true,
//         required: [true, "can't be blank"],
//         match: [/\S+@\S+\.\S+/, 'is invalid'],
//         index: true,
//     },

//     password: {
//         type: String,
//         require: true,
//     }

// }, { timestamps: true });

// UserSchema.pre('save', function (next) {
//     var user = this;

//     if (this.isModified('password') || this.isNew) {
//         bcrypt.genSalt(10, function (err, salt) {
//             if (err) {
//                 return next(err);
//             }
//             bcrypt.hash(user.password, salt, function (err, hash) {
//                 if (err) {
//                     return next(err);
//                 }
//                 user.password = hash;
//                 //console.log('encrypted user password-> ' + user.password);
//                 next();
//             });
//         })
//     }
//     else {
//         return next();
//     }
// })
// UserSchema.methods.comparePassword = function (passw, cb) {
//     bcrypt.compare(passw, this.password, function (err, isMatch) {
//         if (err) {
//             return cb(err);
//         }
//         return cb(null, isMatch);
//     })
// }
// //UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

// module.exports = mongoose.model('User', UserSchema)


// // UserSchema.virtual('fullName').
// //     get(function () {
// //         if (this.surname)
// //             return this.name + ' ' + this.surname;
// //         return this.name;
// //     }).
// //     set(function (fullName) {
// //         fullName = fullName.split(' ');
// //         this.name = fullName[0];
// //         this.surname = fullName[1];
// //     });
// // UserSchema.methods.toAuthJSON = function() {
// //           return {
// //             username: this.username,
// //             email: this.email,
// //             token: this.generateJWT(),
// //             bio: this.bio,
// //             image: this.image
// //         };
// // };

// // UserSchema.methods.setPassword = function (password) {
// //   this.salt = crypto.randomBytes(16).toString('hex');
// //       this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');

// // UserSchema.methods.validPassword = function (password) {
// //      var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
// //      return this.hash === hash;
// //     };

// // UserSchema.methods.generateJWT = function() {
// //     var today = new Date();
// //     var exp = new Date(today);
// //     exp.setDate(today.getDate() + 60);
// //     return jwt.sign({
// //          id: this._id,
// //          username: this.username,
// //          exp: parseInt(exp.getTime() / 1000),
// //         }, secret);
// // };

