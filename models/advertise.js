var mongoose = require('mongoose');
const reqString = {
    type: String,
    required: [true, "can't be blank"],
}
var AdvertiseSchema = new mongoose.Schema({
    adStatus: { type: String, },
    rejectReason: { type: String, },
    advData: {
        departName: reqString,
        postName: reqString,
        startDate: reqString,
        endDate: reqString,
        qualifG: reqString,
        qualifP: { type: String, },
        webLinkAd: reqString,
        webLinkRA: reqString,
    },
    active: {
        type: Boolean,
        default: false,
    },
    userInfo: {
        name: { type: String, },
        email: { type: String, },
        mobile: { type: String, }, 
    },
    adminInfo: {
        name: { type: String },
        email: { type: String, },
        mobile: { type: String, },
    },

}, { timestamps: true });

module.exports = mongoose.model('Advertisement', AdvertiseSchema)
