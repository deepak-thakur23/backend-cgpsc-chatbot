var User = require('../models/user');
var config = require('../config/dbconfig.js');
var jwt = require('jwt-simple');
const { authenticate, serializeUser } = require('passport');
var Profile = require('../models/profile');


var functions = {

    addNewUserAdmin: function (req, res) {

        console.log(`${req.body.email}`)
        if ((!req.body.email) || (!req.body.password) || (!req.body.mobile)|| (!req.body.fullname)) {
            // res.status(403).send({ success: false, message: 'Enter all fields!' });
            res.status(403).send(
                { success: false, message: 'Enter all fields!' }
            )
        }
        else {
            User.findOne({
                email: req.body.email,
            }, function (err, user) {
                if (err) { throw err }
                if (user) {
                    res.status(403).send({
                        success: false,
                        message: `Saved Failed, user already exist..!`
                    })
                }
                //
                else {
                    User.findOne({
                        mobile: req.body.mobile,
                    }, function (err, user) {
                        if (err) { throw err }
                        if (user) {
                            res.status(403).send({
                                success: false,
                                message: `Saved Failed, user  already exist..!`
                            })
                        }
                        else {
                            var newUser = User(req.body
                                // mobile: req.body.mobile,
                                // email: req.body.email,
                                // password: req.body.password,
                            );
                            newUser.save(function (err, newUser) {

                                if (err) {
                                    res.status(403).send({ success: false, message: 'Failed to create account..!' });
                                }
                                else {
                                    res.status(200).send({ success: true, message: 'Acount Created Successfully..!' });
                                }
                            })
                        }

                    })
                }
                //               
            })

        }
    },
    addProfile: async function (req, res) {
        if ((!req.body.firstName) || (!req.body.dob) || (!req.body.gender)) {
            res.status(403).send(
                { success: false, message: 'Enter all fields!' }
            )
        }
        else {
            await User.findOne({
                mobile: req.body.mobile
            }, async function (user, err) {
                if (err) {
                    res.status(403).send({ success: false, message: 'Failed to save profile..!' });
                }
                if (user) {
                    try {
                        let userId = user._id;
                        console.log(`user.mobile: ${user.mobile} and user_id: ${userId}`)
                        const profile = Profile(
                            firstName = req.body.firstName,
                            user = userId,
                            dob = req.body.dob,
                            gender = req.body.gender
                        )
                        data = await profile.save();
                        res.status(200).json({ success: true, data: data });
                    }
                    catch (err) {
                        res.status(400).json({ success: false, message: err.message });
                    }

                }
            })
        }
    },

    authenticate: function (req, res) {
        if ((!req.body.username) && (!req.body.password)) {
            res.status(403).send({
                success: false,
                message: 'Enter all required fields!'
            });
        }
        else {
            User.findOne({
                mobile: req.body.username,
            }, function (err, user) {
                if (err) { throw err }
                if (!user) {
                    res.status(403).send({
                        success: false,
                        message: 'Authentication Failed, user not found..!'
                    })
                } else {
                    user.comparePassword(req.body.password, function (err, isMatch) {
                        if (isMatch && !err) {
                            var token = jwt.encode(user, config.secret)
                            res.status(200).send({ success: true, token: token, mobile: req.body.username })
                        }
                        else {
                            return res.status(403).send({
                                success: false,
                                message: 'Authentication Failed, Password incorrect..!'
                            })
                        }
                    })
                }
            })
        }
    },
    getInfo: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1];
            var decodedtoken = jwt.decode(token, config.secret);
            return res.status(200).send({
                success: true,
                message: 'Welcome..' + decodedtoken.email,
                mobile: decodedtoken.mobile,
                email: decodedtoken.email
            })
        }
        else {
            return res.status(403).send({
                success: false,
                message: 'No headers..!'
            })
        }
    },

}
module.exports = functions;