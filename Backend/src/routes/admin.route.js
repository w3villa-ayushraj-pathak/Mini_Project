const express=require("express")

const {getUsers,getDashboardStats,getUserDetails,}=require("../controllers/admin.controller.js")

const protect=require("../middlewares/auth.middleware.js")

const restrictToAdmin=require("../middlewares/admin.middleware.js")

const router = express.Router();

router.use(protect);

router.use(restrictToAdmin);

router.get("/dashboard", getDashboardStats);

router.get("/users", getUsers);

router.get("/users/:userId", getUserDetails);

module.exports=router;