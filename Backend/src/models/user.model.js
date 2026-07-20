const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      // required: [true, "Password is required"],
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    authProviders: {
      local: {
        enabled: {
          type: Boolean,
          default: true,
        },
      },
      google: {
        id: { type: String, default: null },
        email: { type: String, default: null },
      },
      facebook: {
        id: { type: String, default: null },
        email: { type: String, default: null },
      },
    },

    profileImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },

    phone: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    address: {
      fullAddress: { type: String, default: "" },
      placeId: { type: String, default: "" },
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "" },
      postalCode: { type: String, default: "" },
    },

    currentPlan: {
      planType: {
        type: String,
        enum: ["FREE", "SILVER-1H", "SILVER-6H", "GOLD", "NONE"],
        default: "FREE",
      },
      status: {
        type: String,
        enum: ["ACTIVE", "EXPIRED", "NONE"],
        default: "ACTIVE",
      },
      startsAt: {
        type: Date,
        default: Date.now(),
      },
      expiresAt: {
        type: Date,
        default: Date.now() + 5 * 60 * 1000,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User