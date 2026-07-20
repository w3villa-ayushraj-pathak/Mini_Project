const PLANS=require("../config/plans.config.js");

const getPlanById = (planId) => {
    return Object.values(PLANS).find(plan=>plan.id===planId)
};
module.exports=getPlanById;