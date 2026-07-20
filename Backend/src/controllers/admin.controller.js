const User=require("../models/user.model.js")
const PlanHistory=require("../models/planHistory.model.js")
const Payment=require('../models/payment.model.js')
const catchAsync=require("../utils/catchAsync.util.js")
const AppError=require('../utils/appError.util.js')

const getUsers = catchAsync(
  async (req, res) => {
    const {
      search,
      isEmailVerified,
      planType,
      planStatus,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (isEmailVerified === 'true' || isEmailVerified === 'false') {
      query.isEmailVerified = isEmailVerified
    }
    // else
    // {
    //   query.isEmailVerified = ''
    // }

    if (planStatus?.toUpperCase() === "EXPIRED") {
      const historyQuery = {status: "EXPIRED"};

      if (planType) {
        historyQuery.planType =
          planType.toUpperCase();
      }

      const expiredUserIds =
        await PlanHistory.find(
          historyQuery
        ).distinct("userId");

      query._id = {
        $in: expiredUserIds,
      };
    } else {
      if (planType) {
        query["currentPlan.planType"] =
          planType.toUpperCase();
      }

      if (
        planStatus?.toUpperCase() === "ACTIVE"
      ) {
        query["currentPlan.status"] =
          "ACTIVE";
      }
    }

    const pageNumber = Math.max(
      Number.parseInt(page, 10) || 1,
      1
    );

    const limitNumber = Math.min(
      Math.max(
        Number.parseInt(limit, 10) || 10,
        1
      ),
      100
    );

    const skip =
      (pageNumber - 1) * limitNumber;

    const [users, totalUsers] =
      await Promise.all([
        User.find(query)
          .select("-password")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNumber),

        User.countDocuments(query),
      ]);

    const totalPages = Math.ceil(
      totalUsers / limitNumber
    );

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: {
        users,

        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalUsers,
          limit: limitNumber,
          hasNextPage:
            pageNumber < totalPages,
          hasPreviousPage:
            pageNumber > 1,
        },
      },
    });
  }
);


const getUserDetails = catchAsync(
  async (req, res, next) => {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("-password");

    if (!user) {
      return next(
        new AppError("User not found", 404)
      );
    }

    const paymentHistory = await Payment.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    const planHistory = await PlanHistory.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "User details fetched successfully",

      data: {
        user,
        paymentHistory,
        planHistory,
      },
    });
  }
);

const getDashboardStats = catchAsync(
  async (req, res) => {
    const [
      totalUsers,
      verifiedUsers,
      freeUsers,
      silverUsers,
      goldUsers,
      activePlans,
      expiredPlans,
      revenue,
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        isEmailVerified: true,
      }),

      User.countDocuments({
        "currentPlan.planType": "FREE",
      }),

      User.countDocuments({
        "currentPlan.planType": "SILVER",
      }),

      User.countDocuments({
        "currentPlan.planType": "GOLD",
      }),

      PlanHistory.countDocuments({
        status: "ACTIVE",
      }),

      PlanHistory.countDocuments({
        status: "EXPIRED",
      }),

      Payment.aggregate([
        {
          $match: {
            status: "PAID",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$amount",
            },
          },
        },
      ]),
    ]);

    const users=await User.find({})

    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",

      data: {
        totalUsers,
        verifiedUsers,
        freeUsers,
        silverUsers,
        goldUsers,
        activePlans,
        expiredPlans,
        totalRevenue:
          revenue.length > 0
            ? revenue[0].totalRevenue
            : 0,
      },

      recentUsers:users,

    });
  }
);




module.exports={getUsers,getUserDetails,getDashboardStats}