const express=require('express')
const {signup,verifyEmail,resendVerificationEmail,login,logout,getMe,socialLogin}=require('../controllers/auth.controller')
const protect=require('../middlewares/auth.middleware')

const router=express.Router()

router.post("/signup", signup);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);


router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", logout);
router.post("/social-login", socialLogin);


module.exports=router

