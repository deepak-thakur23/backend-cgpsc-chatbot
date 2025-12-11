var multer = require('multer');
const path = require('path');
var fs = require('fs');


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/avatar')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + req.params.mobile + path.extname(file.originalname))
    }
});
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2
    },
    fileFilter: fileFilter
});
module.exports = upload;