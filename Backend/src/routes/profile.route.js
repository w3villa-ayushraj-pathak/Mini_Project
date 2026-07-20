const express=require('express')
const {getMyProfile,updateMyProfile,uploadProfileImage,downloadMyDetails}=require('../controllers/profile.controller')
const protect=require('../middlewares/auth.middleware')
const {upload}=require('../middlewares/upload.middleware')
const router=express.Router()

router.use(protect)

router.get('/me',getMyProfile)
router.patch('/me',updateMyProfile)
router.patch(
  "/upload-image",
  upload.single("profileImage"),
  uploadProfileImage
);
router.get(
  "/download-details",
  downloadMyDetails
);

module.exports=router