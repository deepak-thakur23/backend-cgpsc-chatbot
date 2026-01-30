var AdminUser = require('../models/adminUser');
var config = require('../config/dbconfig.js');
var jwt = require('jwt-simple');
var Profile = require('../models/profile');

var functions = {

    addNewAdminUser: function (req, res) {

        // const passw = (req.body.email).substring(0, 4) + (req.body.mobile).toString().substring(6, 10)
        // const uname = (req.body.email).substring(0, 4) + (req.body.mobile).toString().substring(6, 10)

        if ((!req.body.email) || (!req.body.fullname) || (!req.body.mobile) || (!req.body.section)) {
            res.status(409).send(
                { success: false, message: 'Enter all fields!' }
            )
        }
        else {
            AdminUser.findOne({
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
                    var newUser = AdminUser(req.body);
                    // newUser.password = passw;
                    newUser.save(function (err, cb) {

                        if (err) {
                            console.log(err)
                            res.status(409).send({ success: false, message: 'Failed to create account [server side]..!' });
                        }
                        else {
                            res.status(200).send({ success: true, message: 'Account Created Successfully..!' });
                        }
                    })
                }

            })
        }
    },
    getAllUser: async function (req, res) {
        await AdminUser.find(function (err, user) {
            if (err) { throw err }
            if (user) {
                res.status(200).send(user);
            }
        });
    },
    toUpdateActiveStatus: async function (req, res) {
        try {
            var chk = new Boolean(true);
            await AdminUser.findOne({ email: req.params.emailId },
                async function (err, user) {
                    if (err) { throw err }
                    if (user.active === true) {
                        chk = false;
                    }
                    if (user.active === false) {
                        chk = true;
                    }
                });
            const filter = { email: req.params.emailId };
            const upsert = { upsert: false };
            const update = {
                $set: {
                    active: chk
                }
            };
            await AdminUser.updateOne(filter, update, upsert)
                .then((results) => {
                    if (results) {
                        res.status(200).json({ success: chk });
                    }
                });
        }
        catch (e) {
            console.log(`error : ${e}`);
        }

    },
    changeFirstPwdAdminUser: async function (req, res) {
        const mobile = req.body.mobile;
        const newPwd = req.body.password;
        await AdminUser.findOne({ mobile }, function (err, user) {
            if (err) { throw err }
            if (user) {
                var userId = user._id;
                var myquery = { _id: userId };
                var option = { upsert: false };
                try {
                    user.pwdtohash(newPwd, async function (err, passw) {
                        if (err) { throw err; }
                        var update = {
                            $set: {
                                password: passw
                            }
                        };
                        try {
                            await AdminUser.updateOne(myquery, update, option)
                                .then((results) => {
                                    if (results) {
                                        res.status(200).json({
                                            success: true,
                                            message: 'Password Updated/Changed Successfully..!',
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
                } catch (err) { console.log(err) }
            }
        })

    },
    changePwdAdminUser: async function (req, res) {
        const mobile = req.body.mobile;
        const curPwd = req.body.currentPwd;
        const newPwd = req.body.newPwd;
        await AdminUser.findOne({ mobile }, function (err, user) {
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
                                        await AdminUser.updateOne(myquery, update, option)
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
    resetPwdAdminUser: async function (req, res) {
        const mobile = req.body.mobile;
        const password = req.body.password;
        await AdminUser.findOne({ mobile }, async function (err, user) {
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
                            await AdminUser.updateOne(myquery, update, option)
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

    chkMobileAdminUser: async function (req, res) {
        const mobile = req.body.mobile;
        try {
            await AdminUser.findOne({ mobile }, async function (err, user) {
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
    chkEmailAdminUser: async function (req, res) {
        const email = req.body.email;
        try {
            await AdminUser.findOne({ email }, async function (err, user) {
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

    addProfileAdminUser: async function (req, res) {

        if ((!req.body.firstName) || (!req.body.dob) || (!req.body.gender)) {
            res.status(409).send(
                { success: false, message: 'Enter all fields!' }
            )
        }
        else {
            await AdminUser.findOne({
                mobile: req.body.mobile
            }, async function (err, user) {
                if (err) {
                    console.log(`Error : ${err}`);
                    res.status(409).send({ success: false, message: 'Failed to save profile..!' });
                }
                if (user) {
                    try {
                        var userId = user._id;
                        console.log(`user.mobile: ${user.mobile} and user_id: ${userId}`)
                        const profile = new Profile({
                            firstName: req.body.firstName,
                            user: user._id,
                            dob: req.body.dob,
                            gender: req.body.gender
                        })
                        data = await profile.save();
                        res.status(200).json({ success: true, data: data });
                    }
                    catch (err) {
                        res.status(200).json({ success: false, message: err.message });
                    }

                }
            })
        }
    },
    imgAddAdminUser: async function (req, res) {
        try {
            const file = req.file;
            const filter = { mobile: req.params.mobile };
            console.log(`file : ${file.path}`);
            const rePath = file.path.replace(/\\/g, '/');
            const update = { $set: { img: rePath } };
            const upsert = { upsert: false };
            await AdminUser.updateOne(filter, update, upsert)
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
    getImageAdminUser: async function (req, res) {
        const filter = { mobile: req.params.mobile };
        try {
            await AdminUser.findOne(filter, function (err, user) {
                if (err) { console.log("Data Not Found :", err) }
                var filePath = user.img;
                res.status(200).json({ success: true, filePath: filePath, })
            });
        } catch (e) {
            cosole.log(`getImage error : ${e}`);
        }
    },


    authenticateAdminUser: async function (req, res) {
        try {
            const { inputType, username, password } = req.body;

            // 1) Basic validation
            if (!inputType || !username || !password) {
                return res.status(400).send({
                    success: false,
                    message: 'Enter all required fields!',
                });
            }

            // 2) Build query based on inputType
            let query = {};
            if (inputType === 'email') {
                query.email = username;
            } else if (inputType === 'mobile') {
                query.mobile = username;
            } else {
                // username case (default)
                query.username = username;
            }

            // 3) Find user
            const user = await AdminUser.findOne(query).exec();

            if (!user) {
                return res.status(200).send({
                    success: false,
                    message: 'User not registered',
                });
            }

            if (!user.isActive) {
                return res.status(200).send({
                    success: false,
                    message: 'Your account is De-Activated..! Please ask to Admin..!',
                });
            }

            // 4) Compare password (wrap callback into a Promise if comparePassword is callback-based)
            const isMatch = await new Promise((resolve, reject) => {
                user.comparePassword(password, (err, same) => {
                    if (err) return reject(err);
                    resolve(same);
                });
            });

            if (!isMatch) {
                return res.status(200).send({
                    success: false,
                    message: 'Password incorrect..!',
                });
            }
            if (user.superadmin) {
                user_role = "superadmin"
            }
            else if (user.isAdmin) {
                user_role = "admin"
            }
            else { user_role = "user" }
            // 5) Generate token
            const token = jwt.encode(
                {
                    id: user._id,
                    role: user_role,
                    username: user.username,
                    isAdmin: user.isAdmin,
                    super_admin: user.superadmin,
                    section: user.section
                },
                config.secret
            );

            // 6) Success response (DO NOT send password)
            return res.status(200).send({
                success: true,
                message: 'Login successfully',
                role: user_role,
                token: token,
                fullname: user.fullname,
                mobile: user.mobile,
                email: user.email

            });

        } catch (err) {
            console.error('authenticateAdminUser error:', err);
            return res.status(500).send({
                success: false,
                message: 'Server error. Please try again LLLater.',
            });
        }
    },

    getInfoAdminUser: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1];
            var decodedtoken = jwt.decode(token, config.secret);
            return res.status(200).send({
                success: true,
                message: 'Welcome, ' + decodedtoken.email,
                mobile: decodedtoken.mobile,
                email: decodedtoken.email,
                admin: decodedtoken.admin,
                name: decodedtoken.name,
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