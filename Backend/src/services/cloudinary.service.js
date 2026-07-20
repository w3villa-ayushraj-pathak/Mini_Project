const cloudinary=require("../config/cloudinary.config.js");

const uploadImageToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "user-management/profile-images",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const uploadVideoToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "lms/content",
        resource_type: "video",
        timeout: 600000, 
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const uploadThumbnailToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "lms/thumbnail",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const deleteImageFromCloudinary = async (publicId) => {
  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId);
};

module.exports={
    uploadImageToCloudinary,
    uploadVideoToCloudinary,
    uploadThumbnailToCloudinary,
    deleteImageFromCloudinary
}