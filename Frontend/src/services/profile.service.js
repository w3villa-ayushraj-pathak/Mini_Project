import api from "./api";

export const getProfile = async () => {
    const response = await api.get("/profile/me");
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await api.patch("/profile/me", data);
    return response.data;
};

export const uploadProfileImage = async (image) => {

    const formData = new FormData();

    formData.append("profileImage", image);

    const response = await api.patch(
        "/profile/upload-image",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;

};

export const downloadMyDetails = async () => {

  const response = await api.get(
    "/profile/download-details",
    {
      responseType: "blob",
    }
  );

  return response;
};