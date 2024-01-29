// lotteryController.js

const { LotteryModel } = require("../models");
const { logger } = require("../utils/logger");
const { Op } = require("sequelize");
const multer = require("multer");
const path = require("path");

// ===============================multer setup ===============================================

// Set up multer storage and file filter
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Set the destination folder for uploaded images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

const fileFilter = (req, file, cb) => {
  // Check file types to allow only images
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

const upload = multer({ storage, fileFilter });

// ===============================multer setup ===============================================

// Get all lotteries
async function getAllLotteries(req, res, next) {
  logger().info("Fetching All Lotteries");
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
  logger().info("Running Create Lottery Function");

  try {
    // Check if the requesting user is an admin
    if (req.user.userName.toLowerCase() !== "admin") {
      return res.status(403).json({
        status: 403,
        error: "Forbidden: Only admin can create lotteries.",
      });
    }

    // ==========================multerrrr ======================================================

    // Use multer middleware to handle image upload
    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          status: 400,
          error: err.message,
        });
      }

      // Get the filename of the uploaded image
      const imageFilename = req.file ? req.file.filename : null;

      const { name, startTime, expiryTime, price, priceType, color } = req.body;

      // Validate the input
      if (
        !name ||
        !startTime ||
        !expiryTime ||
        !price ||
        !priceType ||
        !color
      ) {
        return res.status(400).json({
          status: 400,
          error:
            "Name, start time, end time,color,price type, and price are required fields.",
        });
      }
      const IMAGE_BASE_URL =
        "https://lottocentral-production.up.railway.app/dev/images";

      const imageUrl = `${IMAGE_BASE_URL}/uploads/${imageFilename}`;

      // Create the lottery based on input and include the image filename
      const newLottery = await LotteryModel.create({
        name,
        startTime,
        expiryTime,
        price,
        priceType,
        color,
        image: imageFilename,
        imageUrl: imageUrl,
      });

      // logger().info("new lotto is", newLottery);

      return res.status(200).json({
        status: 200,
        message: "Lottery Created Successfully",
        data: newLottery,
      });
    });

    // ==========================multerrr =======================================================
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
  // const { name, startTime, expiryTime, price, priceType, color } = req.body;

  try {
    // Check if the requesting user is an admin
    if (req.user.userName.toLowerCase() !== "admin") {
      return res.status(403).json({
        status: 403,
        error: "Forbidden: Only admin can create lotteries.",
      });
    }

    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          status: 400,
          error: err.message,
        });
      }

      const lottery = await LotteryModel.findOne({ where: { id: lotteryId } });

      // Get the filename of the uploaded image
      const imageFilename = req.file ? req.file.filename : lottery.image;

      const IMAGE_BASE_URL =
        "https://lottocentral-production.up.railway.app/dev/images";

      const imageUrl = `${IMAGE_BASE_URL}/uploads/${imageFilename}`;

      const { name, startTime, expiryTime, price, priceType, color } = req.body;

      if (!lottery) {
        return res.status(404).json({
          status: 404,
          error: "Lottery not found",
        });
      }

      // Update lottery attributes based on input
      lottery.name = name ? name : lottery.name;
      lottery.startTime = startTime ? startTime : lottery.startTime;
      lottery.expiryTime = expiryTime ? expiryTime : lottery.expiryTime;
      lottery.price = price ? price : lottery.price;
      lottery.priceType = priceType ? priceType : lottery.priceType;
      lottery.color = color ? color : lottery.color;
      lottery.image = imageFilename ? imageFilename : lottery.image;
      lottery.imageUrl = imageUrl ? imageUrl : lottery.imageUrl;

      await lottery.save();

      return res.status(200).json({
        status: 200,
        message: "Lottery updated successfully!",
        lottery: lottery,
      });
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
    if (req.user.userName.toLowerCase() !== "admin") {
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
