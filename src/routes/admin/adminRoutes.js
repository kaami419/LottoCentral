// src/routes/adminRoutes.js

const express = require("express");
const router = express.Router();
const adminController = require("../../controller/adminController");
const { authenticate } = require("../../middlewares/authMiddleware");

// Route to get all admins
router.get("/get", authenticate, adminController.getAllAdmins);
router.post("/login", adminController.loginAdmin);
router.post("/create", adminController.createAdmin);

// Implement other admin routes as needed

module.exports = router;
