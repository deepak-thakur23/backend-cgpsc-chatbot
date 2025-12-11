var Advertisement = require('../models/advertise');
var User = require('../models/adminUser');
var functions = {
    toPublishAdvertise: async function (req, res) {
        try {
            const filter = {
                'advData.departName': req.params.departName,
                'advData.postName': req.params.postName
            };
            const upsert = { upsert: false };
            await User.findOne({ email: req.params.email }, async function (err, user) {
                if (err) throw err;
                const update = {
                    $set: {
                        'adStatus': "PUBLISHED",
                        'active': true,
                        'adminInfo.name': user.name,
                        'adminInfo.email': user.email,
                        'adminInfo.mobile': user.mobile
                    }
                };               
                await Advertisement.updateOne(filter, update, upsert)
                    .then(async (results) => {
                        if (results) {
                            res.status(200).json({
                                success: true,
                            });
                        }
                        else {
                            console.log(`update err : ${err}`);
                            res.status(200).json({ success: false });
                        }
                    });            
            });
        } catch (e) {
            console.log(`error : ${e}`);
        }

    },
    toRejectAdvertise: async function (req, res) {
        try {
            const filter = {
                'advData.departName': req.params.departName,
                'advData.postName': req.params.postName
            };
            const upsert = { upsert: false };
            await User.findOne({ email: req.params.email }, async function (err, user) {
                if (err) throw err;      
                const update = {
                    $set: {
                        'rejectReason': req.params.reason,
                        'adStatus': "REJECTED",
                        'adminInfo.name': user.name,
                        'adminInfo.email': user.email,
                        'adminInfo.mobile': user.mobile
                    }
                };       
            await Advertisement.updateOne(filter, update, upsert)
                .then((results) => {
                    if (results) {
                        res.status(200).json({
                            success: true,
                        });
                    }
                    else {
                        console.log(`update err : ${err}`);
                        res.status(200).json({ success: false });
                    }
                });
            });
        } catch (e) {
            console.log(`error : ${e}`);
        }

    },
    toApproveAdvertise: async function (req, res) {
        try {
            const filter = {
                'advData.departName': req.params.departName,
                'advData.postName': req.params.postName
            };
            const update = {
                $set: {
                    adStatus: "TOAPPROVE"
                }
            };
            const upsert = { upsert: false };
            await Advertisement.updateOne(filter, update, upsert)
                .then((results) => {
                    if (results) {
                        res.status(200).json({
                            success: true,
                        });
                    }
                    else {
                        console.log(`update err : ${err}`);
                        res.status(200).json({ success: false });
                    }
                });
        } catch (e) {
            console.log(`error : ${e}`);
        }

    },
    updateAdvertise: async function (req, res) {
        try {
            const filter = {
                'advData.departName': req.params.departName,
                'advData.postName': req.params.postName
            };
            const update = {
                $set: {
                    'advData.startDate': req.body.advData.startDate,
                    'advData.endDate': req.body.advData.endDate,
                    'advData.qualifG': req.body.advData.qualifG,
                    'advData.qualifP': req.body.advData.qualifP,
                    'advData.webLinkAd': req.body.advData.webLinkAd,
                    'advData.webLinkRA': req.body.advData.webLinkRA,
                }
            };
            const upsert = { upsert: false };
            await Advertisement.updateOne(filter, update, upsert)
                .then((results) => {
                    if (results) {
                        res.status(200).json({
                            success: true,
                        });
                    }
                    else {
                        console.log(`update err : ${err}`);
                        res.status(200).json({ success: false });
                    }
                });
        } catch (e) {
            console.log(`error : ${e}`);
        }

    },
    delAdvertise: async function (req, res) {
        const query = {
            'advData.departName': req.params.departName,
            'advData.postName': req.params.postName
        };
        const result = await Advertisement.deleteOne(query);
        if (result.deletedCount === 1) {
            console.log("Record Deleted..!")
            res.status(200).send({ success: true });
        }
        else {
            res.status(200).send({ success: false });
        }

    },
    getAllAdvertise: async function (req, res) {
        const query = {
                    adStatus: {
                $in: ["INITIALIZE", "TOAPPROVE", "PUBLISHED", "REJECTED", "COMPLETED"]
            }
        };
        const sort = { updatedAt: -1 };
        const adv = await Advertisement.find(query).sort(sort);
        if (adv) {
            res.status(200).send(adv);
        }
        else { res.status(200).send(null); }
    },
    getAdminAdvertise: async function (req, res) {
        const query = {
            $and: [
                { 'adminInfo.email': req.params.email },
                { adStatus: { $in: ["TOAPPROVE", "PUBLISHED", "COMPLETED"] } },
            ]

        };
        const sort = { updatedAt: -1 };
        const adv = await Advertisement.find(query).sort(sort);
            if (adv) {
                res.status(200).send(adv);
            }
            else { res.status(200).send(null); }
    },
    newAdvertise: async function (req, res) {
        if ((!req.body.advData.departName) || (!req.body.advData.postName) || (!req.body.advData.startDate) || (!req.body.advData.endDate) || (!req.body.advData.qualifG) || (!req.body.advData.webLinkAd) || (!req.body.advData.webLinkRA)) {
            res.status(409).send(
                { success: false, message: 'Enter all fields!' }
            )
        }
        else {
            const query = {
                'advData.departName': req.body.advData.departName,
                'advData.postName': req.body.advData.postName
            };
            await Advertisement.findOne(query, async function (err, adv) {

                if (err) {
                    throw err;
                }
                if (adv) {
                    res.status(200).send({
                        success: false,
                        message: `Saved Failed, Advertisemet already exist..!`
                    })
                }
                else {
                    var newAd = Advertisement(req.body);
                    newAd.save(function (err, cb) {
                        if (err) {
                            res.status(409).send({ success: false, message: 'Failed to create advertisement [server side]..!' });
                        }
                        else {
                            res.status(200).send({ success: true, message: 'Advertisement Created Successfully..!' });
                        }
                    })
                }

            })
        }
    },

}
module.exports = functions;