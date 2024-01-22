const express = require("express");
const router = express.Router();
const userController = require("../../controller/userController");
const { authenticate } = require("../../middlewares/authMiddleware");

// Example: Route to get all users
router.get("/get", authenticate, userController.getAllUsers);
router.post("/create", userController.createUser);
router.post("/login", userController.loginUser);
router.put("/update", authenticate, userController.updateUser);
router.put("/delete", authenticate, userController.deleteUser);
router.get("/getSingleUser", authenticate, userController.getSingleUser);

// Define other routes

module.exports = router;
