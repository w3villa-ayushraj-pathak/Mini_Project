const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true, 
        trim: true,
        required: [true, 'Course name is required'],
        minlength: [3, 'Course name must be longer than 3 characters']
    },
    description: { 
        type: String,
        required: [true, 'Course description is required'],
        trim: true
    },
    tutor: {
        name: { type: String, lowercase: true, trim: true },
        qualification: { type: String, default: "" }
    },
    courseAccess: {
        type: String,
        required: true,
        enum: ['free', 'paid'],
        default: 'free'
    },
    duration: {
        type: String, 
        required: true
    },
    content:{
        url: { type: String, default: "" },
        publicId: { type: String, default: "" },
    },
    thumbnail: {
        url: { type: String, default: "" },
        publicId: { type: String, default: "" },
    },
    courseType: {
        type: String,
        required: true,
        enum: ['science', 'arts', 'commerce', 'computer', 'artificial intelligence', 'machine learning']
    },
    rating: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    
}, { timestamps: true });

const courseModel = mongoose.model('course', courseSchema);


module.exports = courseModel;
