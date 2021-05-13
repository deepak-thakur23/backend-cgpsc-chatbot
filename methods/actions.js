var User = require('../models/user');
var config = require('../config/dbconfig.js');
var jwt = require('jwt-simple');
const { authenticate } = require('passport');
const user = require('../models/user');

var functions = {

    addNew: function (req, res) {

        console.log(`${req.body.email}`)
        if ((!req.body.email) || (!req.body.password) || (!req.body.mobile)) {
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
                        message: `Saved Failed, user email already exist..!`
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
                                message: `Saved Failed, user mobile no. already exist..!`
                            })
                        }
                        else {
                            var newUser = User({
                                mobile: req.body.mobile,
                                email: req.body.email,
                                password: req.body.password,
                            });
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
    authenticate: function (req, res) {
        var chk = false;
        if (((!req.body.email) || (!req.body.mobile)) && (!req.body.password)) {
            res.status(403).send({
                success: false,
                message: 'Enter all required fields!'
            });
        }
        else {
            if (!req.body.mobile) {
                User.findOne({
                    email: req.body.email,
                }, function (err, user) {
                    if (err) { throw err }
                    if (!user) {
                        res.status(403).send({
                            success: false,
                            message: 'Authentication Failed, user email not found..!'
                        })
                    } else {
                        user.comparePassword(req.body.password, function (err, isMatch) {
                            if (isMatch && !err) {
                                var token = jwt.encode(user, config.secret)
                                res.status(200).send({ success: true, token: token, email: req.body.email })
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
            } else {
                User.findOne({
                    mobile: req.body.mobile,
                }, function (err, user) {
                    if (err) { throw err }
                    if (!user) {
                        res.status(403).send({
                            success: false,
                            message: 'Authentication Failed, user mobile no. not found..!'
                        })
                    } else {
                        user.comparePassword(req.body.password, function (err, isMatch) {
                            if (isMatch && !err) {
                                var token = jwt.encode(user, config.secret)
                                res.status(200).send({ success: true, token: token, email: req.body.email })
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
        }
    },
    getInfo: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1];
            var decodedtoken = jwt.decode(token, config.secret);
            return res.status(200).send({
                success: true,
                message: 'Welcome..' + decodedtoken.email
            })
        }
        else {
            return res.status(403).send({
                success: false,
                message: 'No headers..!'
            })
        }
    }
}
module.exports = functions;