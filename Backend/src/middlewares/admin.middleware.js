const AppError=require("../utils/appError.util.js");

const restrictToAdmin = (req, res, next) => {
  if (!req.user) {
    return next(
      new AppError("Authentication required", 401)
    );
  }

  if (req.user.role !== "admin") {
    return next(
      new AppError(
        "You are not authorized to access this resource",
        403
      )
    );
  }

  next();
};

module.exports=restrictToAdmin