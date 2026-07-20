const PDFDocument = require("pdfkit");

const User = require("../models/user.model.js");
const Payment = require("../models/payment.model.js");
const PlanHistory = require("../models/planHistory.model.js");
const AppError =require( "../utils/appError.util.js")
const catchAsync =require( "../utils/catchAsync.util.js")
const {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
}=require('../services/cloudinary.service.js')

const getMyProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    data: {
      user,
    },
  });
});

const updateMyProfile = catchAsync(async (req, res, next) => {
  const {
    name,
    phone,
    bio,
    address,
  } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (name !== undefined) {
    if (name.trim().length < 2) {
      return next(
        new AppError("Name must contain at least 2 characters", 400)
      );
    }

    user.name = name.trim();
  }

  if (phone !== undefined) {
    if (phone && !/^[0-9]{10}$/.test(phone)) {
      return next(
        new AppError("Phone number must contain exactly 10 digits", 400)
      );
    }

    user.phone = phone;
  }

  if (bio !== undefined) {
    if (bio.length > 500) {
      return next(
        new AppError("Bio cannot exceed 500 characters", 400)
      );
    }

    user.bio = bio;
  }

  if (address !== undefined) {
    user.address = {
      ...user.address.toObject(),
      ...address,
    };
  }

  await user.save();

  const updatedUser = await User.findById(user._id).select("-password");

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      user: updatedUser,
    },
  });
});


const uploadProfileImage = catchAsync(
  async (req, res, next) => {
    if (!req.file) {
      return next(
        new AppError("Please select an image", 400)
      );
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const uploadResult = await uploadImageToCloudinary(
      req.file.buffer
    );


    const oldPublicId = user.profileImage?.publicId;

    user.profileImage = {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };

    await user.save();

    if (oldPublicId) {
      await deleteImageFromCloudinary(oldPublicId);
    }

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      data: {
        profileImage: user.profileImage,
      },
    });
  }
);


const downloadMyDetails = catchAsync(
  async (req, res, next) => {

    // Get ID from authenticated user, NOT req.params
    const userId = req.user._id;

    const user = await User.findById(userId)
      .select(
        "name email phone bio role isEmailVerified address profileImage currentPlan createdAt"
      );

    if (!user) {
      return next(
        new AppError("User not found", 404)
      );
    }

    // Fetch both histories at the same time
    const [paymentHistory, planHistory] =
      await Promise.all([
        Payment.find({ userId }).sort({
          createdAt: -1,
        }),

        PlanHistory.find({ userId }).sort({
          createdAt: -1,
        }),
      ]);

    // Create PDF
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const safeName = user.name
      ? user.name.replace(/[^a-z0-9]/gi, "_")
      : "user";

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeName}-details.pdf"`
    );

    // Stream PDF directly to response
    doc.pipe(res);

    // ==========================
    // HEADER
    // ==========================

    doc
      .fontSize(22)
      .text("My Account Details", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(10)
      .text(
        `Generated on: ${new Date().toLocaleString()}`
      );

    doc.moveDown(2);

    // ==========================
    // PERSONAL INFORMATION
    // ==========================

    doc
      .fontSize(16)
      .text("Personal Information");

    doc.moveDown();

    doc.fontSize(11);

    doc.text(`Name: ${user.name || "-"}`);

    doc.text(`Email: ${user.email || "-"}`);

    doc.text(`Phone: ${user.phone || "-"}`);

    doc.text(`Bio: ${user.bio || "-"}`);

    doc.text(
      `Email Verified: ${
        user.isEmailVerified ? "Yes" : "No"
      }`
    );

    doc.text(
      `Account Created: ${
        user.createdAt
          ? new Date(
              user.createdAt
            ).toLocaleString()
          : "-"
      }`
    );

    doc.moveDown(2);

    // ==========================
    // ADDRESS
    // ==========================

    doc
      .fontSize(16)
      .text("Address");

    doc.moveDown();

    doc.fontSize(11);

    doc.text(
      `Full Address: ${
        user.address?.fullAddress || "-"
      }`
    );

    doc.text(
      `City: ${user.address?.city || "-"}`
    );

    doc.text(
      `State: ${user.address?.state || "-"}`
    );

    doc.text(
      `Country: ${
        user.address?.country || "-"
      }`
    );

    doc.text(
      `Postal Code: ${
        user.address?.postalCode || "-"
      }`
    );

    doc.moveDown(2);

    // ==========================
    // CURRENT PLAN
    // ==========================

    doc
      .fontSize(16)
      .text("Current Subscription");

    doc.moveDown();

    doc.fontSize(11);

    doc.text(
      `Plan: ${
        user.currentPlan?.planType || "FREE"
      }`
    );

    doc.text(
      `Status: ${
        user.currentPlan?.status || "-"
      }`
    );

    doc.text(
      `Started At: ${
        user.currentPlan?.startsAt
          ? new Date(
              user.currentPlan.startsAt
            ).toLocaleString()
          : "-"
      }`
    );

    doc.text(
      `Expires At: ${
        user.currentPlan?.expiresAt
          ? new Date(
              user.currentPlan.expiresAt
            ).toLocaleString()
          : "-"
      }`
    );

    doc.moveDown(2);

    // ==========================
    // PAYMENT HISTORY
    // ==========================

    doc
      .fontSize(16)
      .text("Payment History");

    doc.moveDown();

    if (paymentHistory.length === 0) {

      doc
        .fontSize(11)
        .text("No payment history found.");

    } else {

      paymentHistory.forEach(
        (payment, index) => {

          doc
            .fontSize(12)
            .text(`Payment ${index + 1}`);

          doc
            .fontSize(10)
            .text(
              `Amount: Rs. ${payment.amount || 0}`
            );

          doc.text(
            `Status: ${payment.status || "-"}`
          );

          doc.text(
            `Payment ID: ${
              payment.razorpayPaymentId || "-"
            }`
          );

          doc.text(
            `Order ID: ${
              payment.razorpayOrderId || "-"
            }`
          );

          doc.text(
            `Date: ${
              payment.createdAt
                ? new Date(
                    payment.createdAt
                  ).toLocaleString()
                : "-"
            }`
          );

          doc.moveDown();

        }
      );

    }

    doc.moveDown();

    // ==========================
    // PLAN HISTORY
    // ==========================

    doc
      .fontSize(16)
      .text("Plan History");

    doc.moveDown();

    if (planHistory.length === 0) {

      doc
        .fontSize(11)
        .text("No plan history found.");

    } else {

      planHistory.forEach(
        (plan, index) => {

          doc
            .fontSize(12)
            .text(
              `${index + 1}. ${
                plan.planType || "Plan"
              }`
            );

          doc
            .fontSize(10)
            .text(
              `Status: ${plan.status || "-"}`
            );

          doc.text(
            `Started: ${
              plan.startsAt
                ? new Date(
                    plan.startsAt
                  ).toLocaleString()
                : "-"
            }`
          );

          doc.text(
            `Expires: ${
              plan.expiresAt
                ? new Date(
                    plan.expiresAt
                  ).toLocaleString()
                : "-"
            }`
          );

          doc.moveDown();

        }
      );

    }

    // Finish PDF
    doc.end();

  }
);


module.exports={getMyProfile,updateMyProfile,uploadProfileImage, downloadMyDetails}