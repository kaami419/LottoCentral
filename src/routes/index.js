const express = require("express");
const router = express.Router();

const userRoutes = require("./user/userRoutes");
const inquiryUserRoutes = require("./InquiryUsers/inquiryUserRoutes");
const lotteryRoutes = require("./lottery/lotteryRoutes");
const ContactUsRoutes = require("./contactUs/contactUsRoutes");
// Import other route files

// Use the routes
router.use("/users", userRoutes);
router.use("/inquiry/user", inquiryUserRoutes);
router.use("/lotteries", lotteryRoutes);
router.use("/contact/us", ContactUsRoutes);
// Use other routes

module.exports = router;
