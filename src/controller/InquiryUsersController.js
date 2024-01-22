// src/controllers/InquiryUserController.js

const { InquiryUsersModel } = require("../models");
const { logger } = require("../utils/logger");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");

async function getAllInquiryUsers(req, res, next) {
  try {
    if (req.user.userName.toLowerCase() !== "admin") {
      return res.status(403).json({
        status: 403,
        error: "Forbidden: Only admin can view lotteries.",
      });
    }
    const InquiryUsers = await InquiryUsersModel.findAll();
    return res.status(200).json(InquiryUsers);
  } catch (error) {
    logger().error("Error getting all Inquiry Users:", error);
    return res
      .status(500)
      .json({ status: 500, error: "Internal Server Error" });
  }
}

async function createInquiryUser(req, res, next) {
  try {
    const { email } = req.body;

    // Validate the input
    if (!email) {
      return res.status(400).json({
        status: 400,
        error: "Email is required.",
      });
    }

    const newInquiryUser = await InquiryUsersModel.create({
      email,
    });

    return res
      .status(201)
      .json({ status: 200, message: "Inquiry user created successfully" });
  } catch (error) {
    logger().error("Error creating Inquiry user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Implement other admin CRUD operations as needed

module.exports = {
  getAllInquiryUsers,
  createInquiryUser,
  // Add other admin functions
};
