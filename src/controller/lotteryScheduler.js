// lotteryScheduler.js

const cron = require("node-cron");
const { LotteryModel } = require("../models/index");
const { Op } = require("sequelize");
const { logger } = require("../utils/logger");

const scheduler = {
  start: () => {
    cron.schedule(
      "0 0 * * *",
      async () => {
        try {
          logger().info("Scheduler Running For Lotteries!!!");
          const currentDateTime = new Date();
          // console.log("date", currentDateTime);

          // Find lotteries whose expiryTime has passed
          const expiredLotteries = await LotteryModel.findAll({
            where: {
              expiryTime: {
                [Op.lte]: currentDateTime,
              },
            },
          });
          logger().info("expired lotteries are", expiredLotteries);
          // Renew expired lotteries
          await Promise.allSettled(
            expiredLotteries.map(async (lottery) => {
              const renewedStartTime = currentDateTime;
              const renewedExpiryTime = new Date(currentDateTime);
              renewedExpiryTime.setDate(currentDateTime.getDate() + 7);

              await lottery.update({
                startTime: renewedStartTime,
                expiryTime: renewedExpiryTime,
              });
            })
          );

          logger().info("Lottery renewal completed.");
        } catch (error) {
          logger().error("Error in lottery renewal cron job:", error);
          return {
            status: 200,
            message: "Internal Server Error",
            error: error,
          };
        }
      },
      {
        timezone: "Asia/Kolkata",
      }
    );
  },
};

module.exports = scheduler;
