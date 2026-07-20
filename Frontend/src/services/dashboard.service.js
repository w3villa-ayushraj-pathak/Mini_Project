import api from "./api";

export const getDashboardStats = async () => {
    const response = await api.get("/admin/dashboard");
    return response.data;
};

export const getUserDetails = async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
};

export const getProfile = async () => {
    const response = await api.get("/profile/me");
    return response.data;
};