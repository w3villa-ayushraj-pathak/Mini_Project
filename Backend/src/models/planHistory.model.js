const mongoose=require('mongoose')

const planHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },

    planId: {
      type: String,
      required: true,
    },

    planType: {
      type: String,
      enum: ["FREE", "SILVER-1H","SILVER-6H" , "GOLD"],
      required: true,
    },

    startedAt: {
      type: Date,
      required: true,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

const PlanHistory = mongoose.model(
  "PlanHistory",
  planHistorySchema
);

module.exports=PlanHistory;