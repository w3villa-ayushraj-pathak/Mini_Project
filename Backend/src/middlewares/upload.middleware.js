const multer =require("multer")
const AppError =require("../utils/appError.util.js")

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Only JPG, PNG and WEBP images are allowed",
        400
      ),
      false
    );
  }
};

const fileFilterForVideo = (req, file, cb) => {
  const allowedMimeTypes = [
    "video/mp4",
    "video/webm",
    "video/quicktime", 
    "video/x-matroska" 
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Invalid file format. Only standard video files (MP4, MOV, WEBM) are allowed.",
        400
      ),
      false
    );
  }
};


const uploadVideo = multer({
  storage,
  fileFilter: fileFilterForVideo,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports={upload,uploadVideo}