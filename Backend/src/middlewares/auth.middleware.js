const jwt =require ("jsonwebtoken");
const User =require ("../models/user.model.js");
const AppError =require ("../utils/appError.util.js");
const catchAsync =require ("../utils/catchAsync.util.js");

const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Not authorized. Token missing.", 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }

  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  req.user = user;
  next();
});

module.exports=protect