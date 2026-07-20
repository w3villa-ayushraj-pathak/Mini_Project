const axios = require("axios");
const https = require("https");

const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync.util");
const AppError = require("../utils/appError.util");

const httpsAgent = new https.Agent({
  family: 4,
  keepAlive: true,
});

/*
|--------------------------------------------------------------------------
| UPDATE USER COORDINATES
|--------------------------------------------------------------------------
|
| PUT /api/map/address
|
| Body:
| {
|   "fullAddress": "Sector 62, Noida, Uttar Pradesh"
| }
|
*/

const updateUserCoordinates = catchAsync(
  async (req, res, next) => {

    // -----------------------------------------
    // 1. Get logged-in user ID
    // -----------------------------------------

    const userId =
      req.user?._id ||
      req.user?.userId;

    if (!userId) {
      return next(
        new AppError(
          "Authenticated user not found",
          401
        )
      );
    }


    // -----------------------------------------
    // 2. Get and validate address
    // -----------------------------------------

    const { fullAddress } = req.body;

    if (
      !fullAddress ||
      typeof fullAddress !== "string" ||
      !fullAddress.trim()
    ) {
      return next(
        new AppError(
          "Full address is required",
          400
        )
      );
    }


    // -----------------------------------------
    // 3. Check whether user exists
    // -----------------------------------------

    const user = await User.findById(userId);

    if (!user) {
      return next(
        new AppError(
          "User account not found",
          404
        )
      );
    }


    // -----------------------------------------
    // 4. Get Positionstack API key
    // -----------------------------------------

    const apiKey =
      process.env.POSITIONSTACK_API_KEY?.trim();

    if (!apiKey) {
      return next(
        new AppError(
          "Positionstack API key is not configured",
          500
        )
      );
    }


    // Safe debugging
    // Does NOT print your complete API key

    console.log(
      "Positionstack key loaded:",
      !!apiKey
    );

    console.log(
      "Positionstack key length:",
      apiKey.length
    );


    // -----------------------------------------
    // 5. Call Positionstack
    // -----------------------------------------

    let response;

    try {

  response = await axios.get(
    "https://api.positionstack.com/v1/forward",
    {
      params: {
        access_key: apiKey,
        query: fullAddress.trim(),
        limit: 1,
      },

      // Force IPv4
      family: 4,

      httpsAgent,

      timeout: 30000,
    }
  );

} catch (error) {

      console.error(
        "Positionstack request failed"
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      console.error(
        "Axios code:",
        error.code
      );


      // Positionstack returned an HTTP error

      if (error.response) {

        const status =
          error.response.status;

        const positionstackError =
          error.response.data?.error;


        let message =
          positionstackError?.message ||
          "Positionstack geocoding request failed";


        // More useful authentication message

        if (status === 401) {

          message =
            positionstackError?.message ||
            "Positionstack rejected the API key";

        }


        // Rate limit

        if (status === 429) {

          message =
            "Positionstack API request limit exceeded";

        }


        return next(
          new AppError(
            message,
            status
          )
        );
      }


      // Request timeout

      if (
        error.code === "ECONNABORTED"
      ) {

        return next(
          new AppError(
            "Positionstack request timed out",
            504
          )
        );

      }


      // DNS / Network / connection error

      return next(
        new AppError(
          "Unable to connect to Positionstack",
          503
        )
      );

    }


    // -----------------------------------------
    // 6. Extract geocoding results
    // -----------------------------------------

    const geoResults =
      response.data?.data;


    if (
      !Array.isArray(geoResults) ||
      geoResults.length === 0
    ) {

      return next(
        new AppError(
          "Address coordinates could not be resolved",
          404
        )
      );

    }


    const matchedLocation =
      geoResults[0];


    // -----------------------------------------
    // 7. Validate coordinates
    // -----------------------------------------

    const latitude =
      matchedLocation.latitude;

    const longitude =
      matchedLocation.longitude;


    if (
      latitude == null ||
      longitude == null
    ) {

      return next(
        new AppError(
          "Valid coordinates were not returned",
          404
        )
      );

    }


    // -----------------------------------------
    // 8. Build address object
    // -----------------------------------------

    const updatedAddressFields = {

      fullAddress:
        matchedLocation.label ||
        fullAddress.trim(),

      /*
       * Positionstack may not always
       * provide an `id`.
       */

      placeId:
        matchedLocation.id || "",

      lat:
        latitude,

      lng:
        longitude,

      city:
        matchedLocation.locality ||
        matchedLocation.county ||
        "",

      state:
        matchedLocation.region ||
        "",

      country:
        matchedLocation.country ||
        "",

      postalCode:
        matchedLocation.postal_code ||
        "",

    };


    // -----------------------------------------
    // 9. Save address in MongoDB
    // -----------------------------------------

    const updatedUser =
      await User.findByIdAndUpdate(

        userId,

        {
          $set: {
            address:
              updatedAddressFields,
          },
        },

        {
          new: true,

          runValidators: true,
        }

      ).select(
        "-password"
      );


    if (!updatedUser) {

      return next(
        new AppError(
          "User account not found",
          404
        )
      );

    }


    // -----------------------------------------
    // 10. Send response
    // -----------------------------------------

    return res.status(200).json({

      success: true,

      message:
        "User location updated successfully",

      data: {

        fullAddress:
          updatedUser.address.fullAddress,

        placeId:
          updatedUser.address.placeId,

        lat:
          updatedUser.address.lat,

        lng:
          updatedUser.address.lng,

        city:
          updatedUser.address.city,

        state:
          updatedUser.address.state,

        country:
          updatedUser.address.country,

        postalCode:
          updatedUser.address.postalCode,

      },

    });

  }
);


/*
|--------------------------------------------------------------------------
| GET USER COORDINATES
|--------------------------------------------------------------------------
|
| GET /api/map/location
|
| Gets location of currently logged-in user.
|
*/

const getUserCoordinates = catchAsync(
  async (req, res, next) => {

    // -----------------------------------------
    // 1. Logged-in user
    // -----------------------------------------

    const userId =
      req.user?._id ||
      req.user?.userId;


    if (!userId) {

      return next(
        new AppError(
          "Authenticated user not found",
          401
        )
      );

    }


    // -----------------------------------------
    // 2. Find user
    // -----------------------------------------

    const user =
      await User.findById(
        userId
      ).select(
        "address name"
      );


    if (!user) {

      return next(
        new AppError(
          "User account not found",
          404
        )
      );

    }


    // -----------------------------------------
    // 3. Check address
    // -----------------------------------------

    if (
      !user.address ||
      user.address.lat == null ||
      user.address.lng == null
    ) {

      return next(
        new AppError(
          "User does not have saved map coordinates",
          400
        )
      );

    }


    // -----------------------------------------
    // 4. Response
    // -----------------------------------------

    return res.status(200).json({

      success: true,

      data: {

        name:
          user.name,

        fullAddress:
          user.address.fullAddress,

        lat:
          user.address.lat,

        lng:
          user.address.lng,

        city:
          user.address.city,

        state:
          user.address.state,

        country:
          user.address.country,

        postalCode:
          user.address.postalCode,

      },

    });

  }
);


module.exports = {

  updateUserCoordinates,

  getUserCoordinates,

};