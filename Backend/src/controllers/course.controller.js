const Course=require('../models/course.model')
const catchAsync=require('../utils/catchAsync.util')
const AppError=require('../utils/appError.util')
const {
  uploadVideoToCloudinary,
  uploadThumbnailToCloudinary,
  deleteImageFromCloudinary,
} = require("../services/cloudinary.service");
const User = require("../models/user.model");


const getCourse = catchAsync(async (req, res) => {
    const course=await Course.find({})

    res.status(200).json({
        success: true,
        message: "Courses fetched",
        data:course
    })
})

const uploadCourse=catchAsync(async(req,res,next)=>{

    const { courseId } = req.params;

    if (!req.file) {
      return next(
        new AppError("Please select an video", 400)
      );
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const uploadResult = await uploadVideoToCloudinary(
      req.file.buffer
    );


    const course = await Course.findById(courseId);

    if (!course) {
        return next(new AppError("Course not found", 404));
    }

    course.content.url=uploadResult.secure_url
    course.content.publicId=uploadResult.public_id

    await course.save()

    res.status(200).json({
        success:true,
        message:"Course video uploaded successfully",
        data:{
            course
        }
    });
})

const uploadThumbnail=catchAsync(async(req,res,next)=>{

    const { courseId } = req.params;

    if (!req.file) {
      return next(
        new AppError("Please select an image", 400)
      );
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const uploadResult = await uploadThumbnailToCloudinary(
      req.file.buffer
    );

    const course = await Course.findById(courseId);

    if (!course) {
        return next(new AppError("Course not found",404));
    }

    course.thumbnail.url=uploadResult.secure_url
    course.thumbnail.publicId=uploadResult.public_id

    await course.save()

    res.status(201).json({
        success: true,
        message: "Course Thumbnail uploaded successfully",
        data: {
            courseThumbnail: course.thumbnail,
        },
    })
})


const courseDetails=catchAsync(async(req,res)=>{

    const {
        name,
        description,
        tutor = {},
        courseAccess,
        duration,
        courseType,
        rating,
    } = req.body;

    const {
        name: tutorName,
        qualification,
    } = tutor;

    const course = await Course.create({
    name,
    description,
    tutor: {
        name: tutorName,
        qualification,
    },
    courseAccess,
    duration,
    courseType,
    rating,
});
    res.status(201).json({
        success: true,
        message: "Course created successfully",
        data: {
            course
        }
    });
})

const deleteCourse=catchAsync(async(req,res,next)=>{
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
        return next(new AppError("Course not found",404));
    }

    await deleteImageFromCloudinary(course.content.publicId);
    await deleteImageFromCloudinary(course.thumbnail.publicId);

    await Course.findByIdAndDelete(courseId);
    res.status(200).json({
        success: true,
        message: "Course deleted successfully",
    })

})

module.exports={getCourse,deleteCourse,uploadCourse,uploadThumbnail,courseDetails}