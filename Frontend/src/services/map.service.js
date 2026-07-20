import api from "./api";


/**
 * Search an address and save
 * coordinates to logged-in user
 */
export const updateUserAddress =
  async (fullAddress) => {

    const response =
      await api.put(
        "/map/address",
        {
          fullAddress,
        }
      );

    return response.data;

  };


/**
 * Get logged-in user's
 * saved coordinates
 */
export const getUserCoordinates =
  async () => {

    const response =
      await api.get(
        "/map/location"
      );

    return response.data;

  };