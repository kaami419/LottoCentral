// src/controllers/InquiryUserController.js

const { InquiryUsersModel } = require("../models");
const { logger } = require("../utils/logger");
const { Our_Email } = require("../utils/common");
const { transporter } = require("../utils/mailer");

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
    logger().info("Creating User With Email");
    const { email } = req.body;

    if (!email) {
      logger().info("No Email Provided");
      return res.status(400).json({
        status: 400,
        error: "Email is required.",
      });
    }

    const duplicateEmailCheck = await InquiryUsersModel.findOne({
      where: {
        email: email,
      },
    });

    if (duplicateEmailCheck) {
      logger().info("Duplicate Email Found");
      return res.status(400).json({
        status: 400,
        error: "User Already Exist With This Email",
      });
    }

    await InquiryUsersModel.create({
      email,
    });
    logger().info("User Created");

    const welcomeMailOptions = {
      from: Our_Email,
      to: email,
      subject: "Welcome to Lotto Central",
      html: `
      <p style= "font-size: 15px; font-weight:bold;">Thank you for signing up! Welcome to Lotto Central.</p>
      <br />
      <p><b>Address</b>: 674 Washington Avenue, Australia</p>
      <p><b>Mobile</b>: 602-216-4143</p>
      <p><b>Email<b/>: info@lottocentral.com</p>
        <img src="https://lottocentral.in/assets/lotto-central-mfyjWcWq.png" style="background-color: rgb(14, 12, 49); width: 200px; height: 75px" />`,
    };

    await transporter.sendMail(welcomeMailOptions);
    logger().info("Welcome Mail sent successfully");

    const notifyMailOptions = {
      from: email,
      to: Our_Email,
      subject: "New Sign Up",
      text: `New user signed up with email: ${email}`,
    };

    await transporter.sendMail(notifyMailOptions);
    logger().info("Notification Mail sent successfully");

    return res
      .status(201)
      .json({ status: 200, message: "User Signed Up Successfully" });
  } catch (error) {
    logger().error("Error creating Inquiry user:", error);
    return next(error);
  }
}

module.exports = {
  getAllInquiryUsers,
  createInquiryUser,
};
