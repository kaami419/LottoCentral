const express = require("express");
const router = express.Router();
const lotteryController = require("../../controller/lotteryController");
// const lotteryScheduler = require("../../controller/lotteryScheduler");
const { authenticate } = require("../../middlewares/authMiddleware");

// Example: Route to get all lotteries
router.get("/get", authenticate, lotteryController.getAllLotteries);
router.post("/create", authenticate, lotteryController.createLottery);
router.get(
  "/getByTime",
  authenticate,
  lotteryController.getLotteriesInTimeRange
);
// Define other routes

module.exports = router;
