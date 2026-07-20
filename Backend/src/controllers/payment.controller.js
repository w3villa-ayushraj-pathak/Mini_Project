const crypto = require("crypto")

const razorpay = require("../config/razorpay.config.js")

const Payment = require('../models/payment.model.js')
const User = require("../models/user.model.js")
const PlanHistory = require("../models/planHistory.model.js")

const getPlanById = require("../utils/getPlanById.util.js")
const AppError = require("../utils/appError.util.js")
const catchAsync = require("../utils/catchAsync.util.js")

const createOrder = catchAsync(
  async (req, res, next) => {
    const { planId } = req.body;

    if (!planId) {
      return next(
        new AppError("Plan ID is required", 400)
      );
    }

    const plan = getPlanById(planId);

    if (!plan) {
      return next(
        new AppError("Invalid pricing plan", 400)
      );
    }

    if (plan.planType === "FREE") {
      return next(
        new AppError(
          "Free plan does not require payment",
          400
        )
      );
    }

    const amountInPaise = plan.price * 100;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: process.env.RAZORPAY_CURRENCY || "INR",

      receipt: `receipt_${Date.now()}`,

      notes: {
        userId: req.user._id.toString(),
        planId: plan.id,
      },
    });

    res.body=order

    const payment = await Payment.create({
      userId: req.user._id,
      planId: plan.id,
      planType: plan.planType,
      amount: plan.price,
      currency: "INR",
      durationHours: plan.durationHours,
      razorpayOrderId: order.id,
      status: "PENDING",
    });

    res.status(201).json({
      success: true,
      message: "Razorpay order created successfully",

      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,

        keyId: process.env.RAZORPAY_KEY_ID,

        paymentId: payment._id,

        plan: {
          id: plan.id,
          name: plan.name,
        },
      },
    });
  }
);


const verifyPayment = catchAsync(
  async (req, res, next) => {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return next(
        new AppError(
          "Payment verification data is required",
          400
        )
      );
    }

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
      userId: req.user._id,
    });

    if (!payment) {
      return next(
        new AppError("Payment record not found", 404)
      );
    }

    if (payment.status === "PAID") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
      });
    }

    const body =
      payment.razorpayOrderId +
      "|" +
      razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      payment.status = "FAILED";

      await payment.save();

      return next(
        new AppError(
          "Payment signature verification failed",
          400
        )
      );
    }

    const plan = getPlanById(payment.planId);

    if (!plan) {
      return next(
        new AppError("Pricing plan not found", 404)
      );
    }

    const user = await User.findById(payment.userId);

    if (!user) {
      return next(
        new AppError("User not found", 404)
      );
    }

    const startedAt = new Date();

    const expiresAt = new Date(
      startedAt.getTime() +
      plan.durationHours * 60 * 60 * 1000
    );

    payment.status = "PAID";

    payment.razorpayPaymentId =
      razorpay_payment_id;

    payment.paidAt = startedAt;

    await payment.save();

    user.currentPlan = {
      planType: plan.planType,
      status: "ACTIVE",
      startsAt: startedAt,
      expiresAt,
    };

    await user.save();

    await PlanHistory.create({
      userId: user._id,
      paymentId: payment._id,
      planId: plan.id,
      planType: plan.planType,
      startedAt,
      expiresAt,
      status: "ACTIVE",
    });

    res.status(200).json({
      success: true,
      message:
        "Payment verified and plan activated successfully",

      data: {
        currentPlan: user.currentPlan,
      },
    });
  }
);


const getPaymentHistory = catchAsync(async (req, res) => {
    console.log(req.user.id)
    const payments = await Payment.find({
        userId: req.user.id
    }).sort({
        createdAt: -1
    });

    console.log(payments)

    res.status(200).json({
        success: true,
        data: {
            payments
        }
    });

});

module.exports = { createOrder, verifyPayment,getPaymentHistory}