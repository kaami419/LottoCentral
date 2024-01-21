const express = require("express");
const router = express.Router();

const userRoutes = require("./user/userRoutes");
const adminRoutes = require("./admin/adminRoutes");
const lotteryRoutes = require("./lottery/lotteryRoutes");
// Import other route files

// Use the routes
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/lotteries", lotteryRoutes);
// Use other routes

module.exports = router;
