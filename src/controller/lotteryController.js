// lotteryController.js

const { LotteryModel } = require("../models");
const { logger } = require("../utils/logger");
const { Op } = require("sequelize");

// Get all lotteries
async function getAllLotteries(req, res, next) {
  try {
    const lotteries = await LotteryModel.findAll();
    return res.status(200).json(lotteries);
  } catch (error) {
    logger().error("Error in getting all lotteries", error);
    next(error);
  }
}

// Create a new lottery
async function createLottery(req, res, next) {
  const { name, startTime, expiryTime, price } = req.body;

  try {
    // Check if the requesting user is an admin
    if (req.user.userName !== "Admin") {
      return res.status(403).json({
        status: 403,
        error: "Forbidden: Only admin can create lotteries.",
      });
    }

    // Validate the input
    if (!name || !startTime || !expiryTime || !price) {
      return res.status(400).json({
        status: 400,
        error: "Name, startTime, endTime, and price are required fields.",
      });
    }

    // Create the lottery based on input
    const newLottery = await LotteryModel.create({
      name,
      startTime,
      expiryTime,
      price,
    });

    return res.status(201).json(newLottery);
  } catch (error) {
    logger().error("Error in creating a lottery", error);
    next(error);
  }
}

// Get lotteries within a specific time range
async function getLotteriesInTimeRange(req, res, next) {
  const { startTime, expiryTime } = req.query;
  logger().info("user is", req.user);
  try {
    const lotteries = await LotteryModel.findAll({
      where: {
        startTime: {
          [Op.gte]: new Date(startTime),
        },
        expiryTime: {
          [Op.lte]: new Date(expiryTime),
        },
      },
    });

    return res.status(200).json(lotteries);
  } catch (error) {
    logger().error("Error in getting lotteries in time range", error);
    next(error);
  }
}

module.exports = {
  getAllLotteries,
  createLottery,
  getLotteriesInTimeRange,
};
