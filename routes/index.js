const express = require('express');
const actionAppUsers = require('../methods/actionAppUsers');
const actionAdminUser = require('../methods/actionAdminUsers');
const actionAds = require('../methods/actionAds');
const actionAppUserAdvs = require('../methods/actionAppUserAdvs');
const router = express.Router();
const upload = require('../controller/imgcontroller');

router.get('/', actionAppUsers.chk)
// AppUserAction Block
router.post('/adduser', actionAppUsers.addNew)

router.post('/changepwd', actionAppUsers.changePwd)

router.post('/resetpwd', actionAppUsers.resetPwd)

router.post('/chkmobile', actionAppUsers.chkMobile)

router.post('/saveProfile', actionAppUsers.saveProfile)

router.post('/addimage/:mobile', upload.single('profilePic'), actionAppUsers.imgAdd)

router.get('/getimage/:mobile', actionAppUsers.getImage)

router.post('/authenticate', actionAppUsers.authenticate)

router.get('/getinfo', actionAppUsers.getAppUserInfo)

// Advertisement Block

router.post('/advertise', actionAds.newAdvertise)

router.get('/advertise', actionAds.getAllAdvertise)

router.delete('/deladvertise/:departName/:postName', actionAds.delAdvertise)

router.put('/editadvertise/:departName/:postName', actionAds.updateAdvertise)

router.put('/toapproveadvertise/:departName/:postName', actionAds.toApproveAdvertise)

router.put('/topublishadvertise/:departName/:postName/:email', actionAds.toPublishAdvertise)

router.put('/torejectadvertise/:departName/:postName/:email/:reason', actionAds.toRejectAdvertise)

router.get('/adminadvertise/:email', actionAds.getAdminAdvertise)

// Admin_User Block
router.post('/api/admin/users', actionAdminUser.addNewAdminUser)

router.post('/changepwdAdminUser', actionAdminUser.changePwdAdminUser)

router.post('/changefirstpwdAdminUser', actionAdminUser.changeFirstPwdAdminUser)

router.post('/resetpwdAdminUser', actionAdminUser.resetPwdAdminUser)

router.post('/chkmobileAdminUser', actionAdminUser.chkMobileAdminUser)

router.post('/chkemailAdminUser', actionAdminUser.chkEmailAdminUser)

router.post('/addprofileAdminUser', actionAdminUser.addProfileAdminUser)

router.post('/addimageAdminUser/:mobile', upload.single('profilePic'), actionAdminUser.imgAddAdminUser)

router.get('/getimageAdminUser/:mobile', actionAdminUser.getImageAdminUser)

router.post('/api/auth/login', actionAdminUser.authenticateAdminUser)

router.get('/getUserInfo', actionAdminUser.getInfoAdminUser)

router.get('/getAllUsers', actionAdminUser.getAllUser)

router.put('/toActiveToggleStatus/:emailId', actionAdminUser.toUpdateActiveStatus)

// AppUser and Advertisment
router.get('/getRecentAdvs/:mobile', actionAppUserAdvs.getRecentAdvs)

router.get('/getCompleteAdvs/:mobile', actionAppUserAdvs.getCompleteAdvs)


module.exports = router