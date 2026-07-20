const cron=require("node-cron")

const User=require("../models/user.model.js")
const PlanHistory=require("../models/planHistory.model.js")

const expirePlansJob = () => {
  cron.schedule("* * * * *", async () => {
    console.log("Checking for expired plans...");

    try {
      const now = new Date();

      const expiredUsers = await User.find({
        "currentPlan.status": "ACTIVE",
        "currentPlan.planType": {
          $in: ["SILVER-1H","SILVER-6H", "GOLD"],
        },
        "currentPlan.expiresAt": {
          $lte: now,
        },
      });

      if (expiredUsers.length === 0) {
        console.log("No expired plans found");
        return;
      }

      for (const user of expiredUsers) {
        await PlanHistory.updateMany(
          {
            userId: user._id,
            status: "ACTIVE",
            expiresAt: {
              $lte: now,
            },
          },
          {
            $set: {
              status: "EXPIRED",
            },
          }
        );

        user.currentPlan = {
          planType: "FREE",
          status: "ACTIVE",
          startsAt: null,
          expiresAt: null,
        };

        await user.save();

        console.log(
          `Plan expired for user: ${user.email}`
        );
      }

      console.log(
        `${expiredUsers.length} plan(s) expired`
      );
    } catch (error) {
      console.error(
        "Plan expiration cron job failed:",
        error
      );
    }
  });
};

module.exports=expirePlansJob;