var User = require('../models/user');
var config = require('../config/dbconfig.js');
var jwt = require('jwt-simple');
const { authenticate } = require('passport');
const user = require('../models/user');

var functions = {

    addNew: function (req, res) {

        if ((!req.body.name) || (!req.body.password)) {
            res.json({ success: false, message: 'Enter all fields!' });
        }
        else {
            var newUser = User({
                name: req.body.name,
                password: req.body.password,
            });
            newUser.save(function (err, newUser) {
                if (err) {
                    res.json({ success: false, message: 'Failed to save' });
                }
                else {
                    res.json({ success: true, message: ' Successfully saved!' });
                }
            })

        }
    },
    authenticate: function (req, res) {
        User.findOne({
            name: req.body.name,
        }, function (err, user) {
            if (err) { throw err }
            if (!user) {
                res.status(403).send({ success: false, message: 'Authentication Failed, User not found..!' })
            }
            else
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        var token = jwt.encode(user, config.secret)
                        res.send({ success: true, token: token })
                    }
                    else {
                        return res.status(403).send({ success: false, message: 'Authentication Failed, Password incorrect..!' })
                    }
                })
        })

    },
    getInfo: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1];
            var decodedtoken = jwt.decode(token, config.secret);
            return res.json({ success: true, massage: 'Hello, ' + decodedtoken.name })
        }
        else {
            return res.json({ success: false, massage: 'No headers..!' })
        }
    }
}
module.exports = functions;