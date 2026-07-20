import api from "./api";

export const getPlans = async () => {
  const response = await api.get("/plans/");
  return response.data;
};

export const createOrder = async (planId) => {
  const response = await api.post("/payment/create-order", {
    planId,
  });

  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await api.post(
    "/payment/verify-payment",
    paymentData
  );

  return response.data;
};

export const getPaymentHistory = async () => {
    const response = await api.get("/payment/history");
    return response.data;
};