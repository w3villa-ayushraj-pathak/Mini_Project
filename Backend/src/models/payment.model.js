const mongoose=require('mongoose')

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    planId: {
      type: String,
      required: true,
    },

    planType: {
      type: String,
      enum: ["FREE", "SILVER_1H","SILVER_6H", "GOLD"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "inr",
    },

    durationHours: {
      type: Number,
      required: true,
    },

    razorpayOrderId: {
      type: String,
      default: null,
      index: true,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports= Payment;