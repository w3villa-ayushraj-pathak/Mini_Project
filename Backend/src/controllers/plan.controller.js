const PLANS =require("../config/plans.config.js");
const User =require("../models/user.model.js");
const AppError=require("../utils/appError.util.js");
const catchAsync =require("../utils/catchAsync.util.js");

const getPlans = catchAsync(
  async (req, res) => {
    const plans = Object.values(PLANS);

    res.status(200).json({
      success: true,
      message: "Pricing plans fetched successfully",
      data: {
        plans,
      },
    });
  }
);

const getCurrentPlan = catchAsync(
  async (req, res, next) => {
    const user = await User.findById(req.user._id)
      .select("currentPlan");

    if (!user) {
      return next(
        new AppError("User not found", 404)
      );
    }

    res.status(200).json({
      success: true,
      message: "Current plan fetched successfully",
      data: {
        currentPlan: user.currentPlan,
      },
    });
  }
);

module.exports={getPlans,getCurrentPlan}