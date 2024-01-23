// src/routes/adminRoutes.js

const express = require("express");
const router = express.Router();
const inquiryUserController = require("../../controller/InquiryUsersController");
const { authenticate } = require("../../middlewares/authMiddleware");

// Route to get all admins
router.get("/get", authenticate, inquiryUserController.getAllInquiryUsers);
router.post("/create", inquiryUserController.createInquiryUser);

// Implement other admin routes as needed

module.exports = router;
