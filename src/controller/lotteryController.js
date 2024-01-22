// lotteryController.js

const { LotteryModel } = require("../models");
const { logger } = require("../utils/logger");
const { Op } = require("sequelize");

// Get all lotteries
async function getAllLotteries(req, res, next) {
  try {
    const lotteries = await LotteryModel.findAll({
      where: {
        enable: true,
        deleted: false,
      },
    });
    return res.status(200).json(lotteries);
  } catch (error) {
    logger().error("Error in getting all lotteries", error);
    next(error);
  }
}

// Create a new lottery
async function createLottery(req, res, next) {
  const { name, startTime, expiryTime, price, priceType, color } = req.body;

  try {
    // Check if the requesting user is an admin
    if (req.user.userName !== "Admin") {
      return res.status(403).json({
        status: 403,
        error: "Forbidden: Only admin can create lotteries.",
      });
    }

    // Validate the input
    if (!name || !startTime || !expiryTime || !price || !priceType || !color) {
      return res.status(400).json({
        status: 400,
        error:
          "Name, start time, end time,color,price type, and price are required fields.",
      });
    }

    // Create the lottery based on input
    const newLottery = await LotteryModel.create({
      name,
      startTime,
      expiryTime,
      price,
      priceType,
      color,
    });

    return res
      .status(200)
      .json({
        status: 200,
        message: "Lottery Created Successfully",
        data: newLottery,
      });
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
        enable: true,
        deleted: false,
      },
    });

    return res.status(200).json(lotteries);
  } catch (error) {
    logger().error("Error in getting lotteries in time range", error);
    next(error);
  }
}

// Update a lottery
async function updateLottery(req, res, next) {
  const lotteryId = req.query.id;
  const { name, startTime, expiryTime, price, priceType, color } = req.body;

  try {
    // Check if the requesting user is an admin
    if (req.user.userName !== "Admin") {
      return res.status(403).json({
        status: 403,
        error: "Forbidden: Only admin can create lotteries.",
      });
    }
    const lottery = await LotteryModel.findOne({ where: { id: lotteryId } });

    if (!lottery) {
      return res.status(404).json({
        status: 404,
        error: "Lottery not found",
      });
    }

    // Update lottery attributes based on input
    lottery.name = name || lottery.name;
    lottery.startTime = startTime || lottery.startTime;
    lottery.expiryTime = expiryTime || lottery.expiryTime;
    lottery.price = price || lottery.price;
    lottery.priceType = priceType || lottery.priceType;
    lottery.color = color || lottery.color;

    await lottery.save();

    return res.status(200).json({
      status: 200,
      message: "Lottery updated successfully!",
      lottery: lottery,
    });
  } catch (error) {
    logger().error("Error in updating lottery", error);
    next(error);
  }
}

// Delete a lottery
async function deleteLottery(req, res, next) {
  const lotteryId = req.query.id;

  try {
    // Check if the requesting user is an admin
    if (req.user.userName !== "Admin") {
      return res.status(403).json({
        status: 403,
        error: "Forbidden: Only admin can create lotteries.",
      });
    }
    const lottery = await LotteryModel.findOne({ where: { id: lotteryId } });

    if (!lottery) {
      return res.status(404).json({
        status: 404,
        error: "Lottery not found",
      });
    }

    await lottery.update({
      enable: false,
      deleted: true,
    });

    return res.status(200).json({
      status: 200,
      message: "Lottery deleted successfully!",
    });
  } catch (error) {
    logger().error("Error in deleting lottery", error);
    next(error);
  }
}

module.exports = {
  getAllLotteries,
  createLottery,
  getLotteriesInTimeRange,
  updateLottery,
  deleteLottery,
};
