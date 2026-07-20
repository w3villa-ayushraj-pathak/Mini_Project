const express=require("express")
const { getPlans,getCurrentPlan } =require("../controllers/plan.controller.js")

const protect=require("../middlewares/auth.middleware.js")

const router = express.Router();

router.get("/", getPlans);

router.get("/current",protect,getCurrentPlan);

module.exports=router;