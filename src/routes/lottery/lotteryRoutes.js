const express = require("express");
const router = express.Router();
const lotteryController = require("../../controller/lotteryController");
// const lotteryScheduler = require("../../controller/lotteryScheduler");
const { authenticate } = require("../../middlewares/authMiddleware");

// Example: Route to get all lotteries
router.get("/get", lotteryController.getAllLotteries);
router.post("/create", authenticate, lotteryController.createLottery);
router.get("/getByTime", lotteryController.getLotteriesInTimeRange);
router.put("/update", authenticate, lotteryController.updateLottery);
router.put("/delete", authenticate, lotteryController.deleteLottery);

// Define other routes

module.exports = router;
