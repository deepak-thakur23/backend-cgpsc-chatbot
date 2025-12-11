var Advertisement = require('../models/advertise')
var AppUser = require('../models/appUser');
var Profile = require('../models/profile');
var functions = {
    getRecentAdvs: async function (req, res) {
        const filter = { mobile: req.params.mobile };
        try {
            await AppUser.findOne(filter, async function (err, user) {
                if (err) { throw err }
                if (user) {
                    var userId = user._id;
                    await Profile.findOne({ user: userId }, async function (err, profile) {
                        if (err) { throw err }
                        if (profile) {
                            var graduate = "";
                            var pg = "";
                            // var ssc = "";
                            // var hsc = "";
                            // if (profile.ssc = 'Yes') { ssc = '10TH'; }
                            // if (profile.hsc = 'Yes') { hsc = '12TH'; }
                            if (profile.gradOn != null) {
                                graduate = "Graduate"
                            } if (profile.pgOn != null) {
                                pg = "Post Graduate"
                            }
                            const query = {
                                $and: [{ adStatus: "PUBLISHED" }, {
                                    $or: [
                                        // { ssc: ssc },
                                        // { hsc: hsc },
                                        { 'advData.qualifG': profile.gradOn },
                                        { 'advData.qualifP': profile.pgOn },
                                        { 'advData.qualifG': graduate },
                                        { 'advData.qualifP': pg },
                                    ]
                                }]
                            };
                            const sort = { updatedAt: -1 };
                            const adv = await Advertisement.find(query).sort(sort);
                            console.log(adv)
                            res.status(200).send(adv);
                        }
                    });
                }
            });
        }
        catch (e) {
            console.log(`Error accour--> $e`)
        }
    },

    getCompleteAdvs: async function (req, res) {
        const filter = { mobile: req.params.mobile };
        try {
            await AppUser.findOne(filter, async function (err, user) {
                if (err) { throw err }
                if (user) {
                    var userId = user._id;
                    await Profile.findOne({ user: userId }, async function (err, profile) {
                        if (err) { throw err }
                        if (profile) {
                            var graduate = "";
                            var pg = "";
                            // var ssc = "";
                            // var hsc = "";
                            // if (profile.ssc = 'Yes') { ssc = '10TH'; }
                            // if (profile.hsc = 'Yes') { hsc = '12TH'; }
                            if (profile.gradOn != null) {
                                graduate = "Graduate"
                            } if (profile.pgOn != null) {
                                pg = "Post Graduate"
                            }
                            const query = {
                                $and: [{ adStatus: "COMPLETED" }, {
                                    $or: [
                                        // { ssc: ssc },
                                        // { hsc: hsc },
                                        { 'advData.qualifG': profile.gradOn },
                                        { 'advData.qualifP': profile.pgOn },
                                        { 'advData.qualifG': graduate },
                                        { 'advData.qualifP': pg },
                                    ]
                                }]
                            };
                            const sort = { updatedAt: -1 };
                            const adv = await Advertisement.find(query).sort(sort);
                            console.log(adv)
                            res.status(200).send(adv);
                        }
                    });
                }
            });
        }
        catch (e) {
            console.log(`Error accour--> $e`)
        }
    },
}
module.exports = functions;