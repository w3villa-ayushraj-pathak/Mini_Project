import api from "./api";

export const getCourses = async () => {
  const response = await api.get("/course");

  return response.data;
};


export const createCourseDetails = async (courseData) => {
    const response = await api.post(
        "/course/upload-courseDetails",
        courseData
    );

    return response.data;
};



export const uploadCourseThumbnail = async (
    courseId,
    thumbnailImage
) => {

    const formData = new FormData();

    formData.append(
        "thumbnailImage",
        thumbnailImage
    );

    const response = await api.post(
        `/course/${courseId}/thumbnail`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};


export const uploadCourseVideo = async (
    courseId,
    contentVideo,
    onUploadProgress
) => {

    const formData = new FormData();

    formData.append(
        "contentVideo",
        contentVideo
    );

    const response = await api.post(
        `/course/${courseId}/video`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },

            onUploadProgress,
        }
    );

    return response.data;
};



export const deleteCourse = async (courseId) => {
    const response = await api.delete(
        `/course/${courseId}`
    );

    return response.data;
};