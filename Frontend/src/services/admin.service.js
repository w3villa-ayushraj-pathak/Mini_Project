import api from "./api";

export const getDashboard = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

export const getAllUsers = async (
    page,
    limit,
    search,
    planStatus,
    planType,
    isEmailVerified
) => {

    console.log(planType)

    const response = await api.get("/admin/users", {

        params: {

            page,
            limit,
            search,
            planStatus,
            planType,
            isEmailVerified
        }

    });

    return response.data;

};

export const getUserDetails = async (userId) => {
  const response = await api.get(`/admin/users/${userId}`);
  return response.data;
};
