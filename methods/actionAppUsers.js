var AppUser = require('../models/appUser');
var config = require('../config/dbconfig.js');
var jwt = require('jwt-simple');
var Profile = require('../models/profile');

var functions = {

    chk: function (req, res) {
        res.status(200).send(
            { success: true, message: 'Backend Server is working and responding..!' })
    },

    addNew: function (req, res) {
        if ((!req.body.email) || (!req.body.password) || (!req.body.mobile)) {
            // res.status(403).send({ success: false, message: 'Enter all fields!' });
            res.status(409).send(
                { success: false, message: 'Enter all fields!' }
            )
        }
        else {
            AppUser.findOne({
                $or: [{ email: req.body.email },
                { mobile: req.body.mobile }]
            }, function (err, user) {
                if (err) { throw err }
                if (user) {
                    res.status(200).send({
                        success: false,
                        message: `Saved Failed, User already exist..!`
                    })
                }
                else {
                    var newUser = AppUser(req.body);
                    newUser.save(function (err, cb) {

                        if (err) {
                            res.status(409).send({ success: false, message: 'Failed to create account [server side]..!' });
                        }
                        else {
                            res.status(200).send({ success: true, message: 'Acount Created Successfully..!' });
                        }
                    })
                }

            })
        }
    },
    changePwd: async function (req, res) {
        const mobile = req.body.mobile;
        const curPwd = req.body.currentPwd;
        const newPwd = req.body.newPwd;
        await AppUser.findOne({ mobile }, function (err, user) {
            if (err) { throw err }
            if (user) {
                try {
                    user.comparePassword(curPwd, async function (err, isMatch) {
                        var userId = user._id;
                        if (isMatch && !err) {
                            var myquery = { _id: userId };
                            var option = { upsert: false };
                            try {
                                await user.pwdtohash(newPwd, async function (err, passw) {
                                    if (err) { throw err; }
                                    var update = {
                                        $set: {
                                            password: passw
                                        }
                                    };
                                    try {
                                        await AppUser.updateOne(myquery, update, option)
                                            .then((results) => {
                                                if (results) {
                                                    res.status(200).json({
                                                        success: true,
                                                        message: 'Password Updated Successfully..!',
                                                    });
                                                }
                                                else {
                                                    console.log(`Error on password updation : ${err}`);
                                                    res.status(409).send({ success: false, message: 'Error on update password' });
                                                }
                                            })
                                    }
                                    catch (e) { console.log(e); }
                                })
                            } catch (err) {
                                console.log(err)
                            }
                        } else {
                            return res.status(200).send({
                                success: false,
                                message: 'Current Password incorrect..!'
                            })
                        }

                    })
                }
                catch (err) {
                    res.status(400).json({ success: false, message: err.message });
                }
            }
        })
    },
    resetPwd: async function (req, res) {
        const mobile = req.body.mobile;
        const password = req.body.password;
        await AppUser.findOne({ mobile }, async function (err, user) {
            if (err) { throw err }
            if (user) {
                var userId = user._id;
                var myquery = { _id: userId };
                var option = { upsert: false };
                try {
                    await user.pwdtohash(password, async function (err, passw) {
                        if (err) { throw err; }
                        var update = { $set: { password: passw } };
                        try {
                            await AppUser.updateOne(myquery, update, option)
                                .then((results) => {
                                    if (results) {
                                        res.status(200).json({
                                            success: true,
                                            message: 'Password Reset Successfully..!',
                                        });
                                    }
                                    else {
                                        console.log(`Error on password updation : ${err}`);
                                        res.status(409).send({ success: false, message: 'Error on update password' });
                                    }
                                })
                        }
                        catch (e) { console.log(e); }
                    })
                }
                catch (err) { console.log(err) }
            }
            else {
                return res.status(200).send({
                    success: false,
                    message: 'User not registered..!'
                })
            }
        })
    },

    chkMobile: async function (req, res) {
        const mobile = req.body.mobile;
        try {
            await AppUser.findOne({ mobile }, async function (err, user) {
                if (err) { throw err }
                if (user) {
                    res.status(200).json({
                        success: true,
                        message: 'User Exists!',
                    });
                }
                else {
                    res.status(200).send({ success: false, message: 'User not registered!' });
                }
            })
        } catch (e) {
            console.log(e);
            res.status(409).send({ success: false, message: 'Server side error!' });
        }
    },

    saveProfile: async function (req, res) {
        const mobile = req.body.mobile;
        if ((!req.body.name) || (!req.body.dob) || (!req.body.gender)) {
            res.status(409).send(
                { success: false, message: 'Enter all fields!' }
            )
        }
        else {
            await AppUser.findOne({ mobile }, async function (err, user) {
                if (err) {
                    console.log(`Error : ${err}`);
                    res.status(409).send({ success: false, message: 'Failed to save profile..!' });
                }
                if (user) {
                    var userId = user._id;
                    await Profile.findOne({ user: user._id }, async function (err, profile) {
                        if (err) throw err;
                        if (!profile) {
                            try {
                                console.log(`user.mobile: ${user.mobile} user id: ${user._id}`)
                                const profile = new Profile({
                                    name: req.body.name,
                                    user: user._id,
                                    dob: req.body.dob,
                                    gender: req.body.gender,
                                    ssc: req.body.ssc,
                                    hsc: req.body.hsc,
                                    gradOn: req.body.gradOn,
                                    pgOn: req.body.pgOn,
                                    acadExp: req.body.acadExp,
                                    techExp: req.body.techExp,
                                    otherExp: req.body.otherExp
                                })
                                data = await profile.save();
                                var profileToken = jwt.encode(data, config.secret)
                                res.status(200).json({ success: true, message: "Profile data saved successfully", profileToken: profileToken, });
                            }
                            catch (err) {
                                res.status(200).json({ success: false, message: err.message });
                            }

                        }
                        else {
                            try {
                                var myquery = { user: userId };
                                var option = { upsert: false };
                                var update = {
                                    $set: {
                                        name: req.body.name,
                                        dob: req.body.dob,
                                        gender: req.body.gender,
                                        ssc: req.body.ssc,
                                        hsc: req.body.hsc,
                                        gradOn: req.body.gradOn,
                                        pgOn: req.body.pgOn,
                                        acadmicExp: req.body.acadExp,
                                        techExp: req.body.techExp,
                                        otherExp: req.body.otherExp
                                    }
                                };
                                await Profile.updateOne(myquery, update, option)
                                    .then(async (results) => {
                                        if (results) {
                                            await Profile.findOne(myquery, async function (err, profile) {
                                                if (err) throw err;
                                                if (profile) {
                                                    var profileToken = jwt.encode(profile, config.secret);
                                                    res.status(200).json({
                                                        success: true,
                                                        message: "Profile Updated Successfully..!",
                                                        profileToken: profileToken
                                                    });
                                                }
                                                else {
                                                    console.log(`update err : ${err}`);
                                                    res.status(200).json({ success: false, message: "Profile Updated Failed..!" });
                                                }
                                            });

                                        }
                                        else {
                                            console.log(`update err : ${err}`);
                                            res.status(200).json({ success: false, message: err.message });
                                        }
                                    });
                            }
                            catch (err) {
                                res.status(200).json({ success: false, message: err.message });
                            }
                        }
                    })

                }
            })
        }
    },
    imgAdd: async function (req, res) {
        try {
            const file = req.file;
            const filter = { mobile: req.params.mobile };
            console.log(`file : ${file.path}`);
            const rePath = file.path.replace(/\\/g, '/');
            const update = { $set: { img: rePath } };
            const upsert = { upsert: false };
            await AppUser.updateOne(filter, update, upsert)
                .then((results) => {
                    if (results) {
                        res.status(200).json({
                            success: true,
                            filePath: rePath,
                        });
                    }
                    else {
                        console.log(`img update err : ${err}`);
                        res.status(200).json({ success: false, message: err.message });
                    }
                });
        } catch (e) {
            console.log(`addImage error : ${e}`);
        }

    },
    getImage: async function (req, res) {
        const filter = { mobile: req.params.mobile };
        try {
            await AppUser.findOne(filter, function (err, user) {
                if (err) { console.log("Data Not Found :", err) }
                var filePath = user.img;
                res.status(200).json({ success: true, filePath: filePath, })
            });
        } catch (e) {
            cosole.log(`getImage error : ${e}`);
        }
    },
    authenticate: async function (req, res) {
        if (((!req.body.email) || (!req.body.mobile)) && (!req.body.password)) {
            res.status(409).send({
                success: false,
                message: 'Enter all required fields!'
            });
        }
        else {
            await AppUser.findOne({
                $or: [{ email: req.body.email },
                { mobile: req.body.mobile }]
            }, async function (err, user) {
                if (err) { throw err }
                if (!user) {
                    res.status(200).send({
                        success: false,
                        message: 'User not registered..!'
                    })
                }
                else {
                    const userId = user._id;
                    var profileToken;
                    await Profile.findOne({ user: userId }, async function (err, userProfile) {
                        if (err) { throw err }
                        if (userProfile) {
                            profileToken = jwt.encode(userProfile, config.secret);
                        }
                        if (!userProfile) {
                            profileToken = null;
                        }
                    })
                    await user.comparePassword(req.body.password, function (err, isMatch) {
                        if (isMatch && !err) {
                            var token = jwt.encode(user, config.secret)
                            res.status(200).send({ success: true, token: token, profileToken: profileToken })
                        }
                        else {
                            return res.status(200).send({
                                success: false,
                                message: 'Password incorrect..!'
                            })
                        }
                    });
                }
            });
        }
    },

    getAppUserInfo: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1];
            var decodedtoken = jwt.decode(token, config.secret);
            return res.status(200).send({
                success: true,
                message: 'Welcome, ' + decodedtoken.email,
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