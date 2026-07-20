const express=require('express')
const {getCourse,deleteCourse,uploadCourse,uploadThumbnail,courseDetails}=require('../controllers/course.controller')
const {upload,uploadVideo}=require('../middlewares/upload.middleware')
const protect=require("../middlewares/auth.middleware.js")
const restrictToAdmin=require("../middlewares/admin.middleware.js")


const router=express.Router()


router.get('/',getCourse)
router.use(protect)
router.use(restrictToAdmin)


router.delete('/:courseId', deleteCourse);
router.post(
    "/:courseId/video",
    uploadVideo.single("contentVideo"),
    uploadCourse
);
router.post(
    "/:courseId/thumbnail",
    upload.single("thumbnailImage"),
    uploadThumbnail
);
router.post('/upload-courseDetails',courseDetails)




module.exports=router