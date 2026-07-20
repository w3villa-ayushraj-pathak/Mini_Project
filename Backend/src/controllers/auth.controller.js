const bcrypt =require ("bcryptjs");
const User =require ("../models/user.model.js");
const VerificationToken =require ("../models/verificationToken.model.js");
const AppError =require ("../utils/appError.util.js");
const catchAsync =require ("../utils/catchAsync.util.js");
const generateVerificationToken =require ("../utils/generateVerificationToken.util.js");
const sendVerificationEmail=require('../services/email.service.js')
const generateToken=require('../utils/generateToken.util.js');
const admin=require('../config/firebaseAdmin.js')

const createAndSaveVerificationToken = async (userId) => {
  await VerificationToken.deleteMany({ userId });

  const token = generateVerificationToken();

  const verificationTokenDoc = await VerificationToken.create({
    userId,
    token,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
  });

  return verificationTokenDoc;
};

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError("Name, email and password are required", 400));
  }

  if (password.length < 6) {
    return next(
      new AppError("Password must be at least 6 characters long", 400)
    );
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    res.status(400).json({
      message:'User already registered'
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
  });

  const verificationTokenDoc = await createAndSaveVerificationToken(user._id);

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationTokenDoc.token}`;

  await sendVerificationEmail({
    to: user.email,
    name: user.name,
    verificationUrl,
  });

  res.status(201).json({
    success: true,
    message:
      "Signup successful. Verification email sent to your registered email address.",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        role: user.role,
      },
    },
  });
});

const verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return next(new AppError("Verification token is required", 400));
  }



  const tokenDoc = await VerificationToken.findOne({ token });

  if (!tokenDoc) {
    return next(new AppError("Invalid or expired verification token", 400));
  }

  if (tokenDoc.expiresAt < new Date()) {
    await VerificationToken.deleteOne({ _id: tokenDoc._id });
    return next(new AppError("Verification token has expired", 400));
  }

  const user = await User.findById(tokenDoc.userId);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (user.isEmailVerified) {
    await VerificationToken.deleteOne({ _id: tokenDoc._id });

    return res.status(200).json({
      success: true,
      message: "Email is already verified",
    });
  }

  user.isEmailVerified = true;
  await user.save();

  await VerificationToken.deleteOne({ _id: tokenDoc._id });

  res.status(200).json({
    success: true,
    message: "Email verified successfully. You can now log in.",
  });
});

const resendVerificationEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return next(new AppError("User not found with this email", 404));
  }

  if (user.isEmailVerified) {
    return next(new AppError("Email is already verified", 400));
  }

  const verificationTokenDoc = await createAndSaveVerificationToken(user._id);

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationTokenDoc.token}`;

  await sendVerificationEmail({
    to: user.email,
    name: user.name,
    verificationUrl,
  });

  res.status(200).json({
    success: true,
    message: "Verification email sent successfully",
  });
});

const login = catchAsync(async (req, res, next) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    return next(new AppError("Invalid email or password", 401));
  }

  if (!user.isEmailVerified) {
    return next(
      new AppError("Please verify your email before logging in", 401)
    );
  }

  const token = generateToken({
    userId: user._id,
    role: user.role,
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        currentPlan: user.currentPlan,
      },
    },
  });
});

const getMe = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Current user fetched successfully",
    data: req.user,
  });
});

const logout = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});


const socialLogin = catchAsync(async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    return next(new AppError("Firebase Identity ID Token is required", 400));
  }

  const decodedToken = await admin.auth().verifyIdToken(idToken);
  const { email, name, picture, uid, firebase } = decodedToken;

  if (!email) {
    return next(new AppError("Email access authorization is required from social provider.", 400));
  }

  const normalizedEmail = email.toLowerCase().trim();
  let user = await User.findOne({ email: normalizedEmail });

  const providerId = firebase.sign_in_provider; 

  if (!user) {
    const authProviders = {
      local: { enabled: false }, // Social users don't use standard local login fields initially
      google: { id: providerId === "google.com" ? uid : null, email: providerId === "google.com" ? normalizedEmail : null },
      facebook: { id: providerId === "facebook.com" ? uid : null, email: providerId === "facebook.com" ? normalizedEmail : null }
    };

    user = await User.create({
      name: name || normalizedEmail.split("@")[0],
      email: normalizedEmail,
      // password: await bcrypt.hash(Math.random().toString(36).slice(-12), 10), 
      isEmailVerified: true, 
      authProviders,
      profileImage: {
        url: picture || "",
        publicId: ""
      }
    });
  } else {
    let structureUpdated = false;
    
    if (providerId === "google.com" && !user.authProviders?.google?.id) {
      user.authProviders.google = { id: uid, email: normalizedEmail };
      structureUpdated = true;
    } else if (providerId === "facebook.com" && !user.authProviders?.facebook?.id) {
      user.authProviders.facebook = { id: uid, email: normalizedEmail };
      structureUpdated = true;
    }

    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      structureUpdated = true;
    }

    if (structureUpdated) {
      await user.save();
    }
  }

  const token = generateToken({
    userId: user._id,
    role: user.role,
  });

  return res.status(200).json({
    success: true,
    message: "Social login validation successful",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        currentPlan: user.currentPlan,
      },
    },
  });
});


module.exports={signup,verifyEmail,resendVerificationEmail,login,logout,getMe, socialLogin}