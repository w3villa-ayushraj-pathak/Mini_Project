const AppError=require("../utils/AppError.js");

const requirePremiumPlan = (req, res, next) => {
    const { currentPlan } = req.user;

    if (!currentPlan) {
        return next(
            new AppError("Premium plan is required", 403)
        );
    }

    if (currentPlan.status !== "ACTIVE" ||!["SILVER-1H", "SILVER-6H", "GOLD"].includes(currentPlan.planType)) {
        return next(
            new AppError(
                "Active premium plan is required",
                403
            )
        );
    }

    if (
        currentPlan.expiresAt &&
        new Date(currentPlan.expiresAt) <= new Date()
    ) {
        return next(
            new AppError(
                "Your premium plan has expired",
                403
            )
        );
    }

    next();
};

module.exports=requirePremiumPlan