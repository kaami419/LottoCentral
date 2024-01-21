// src/controllers/adminController.js

const { AdminModel } = require("../models");
const { logger } = require("../utils/logger");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function getAllAdmins(req, res, next) {
  try {
    const admins = await AdminModel.findAll();
    return res.status(200).json(admins);
  } catch (error) {
    logger().error("Error getting all admins:", error);
    return res
      .status(500)
      .json({ status: 500, error: "Internal Server Error" });
  }
}

async function loginAdmin(req, res) {
  try {
    const { username, password } = req.body;
    const admin = await AdminModel.findOne({ where: { username } });

    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return res
        .status(401)
        .json({ status: 400, error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin.id }, "shshs", {
      expiresIn: "2h", // Token expiration time
    });

    return res.status(200).json({
      status: 200,
      message: "Admin LoggedIn Successfully!",
      token: token,
    });
  } catch (error) {
    logger().error("Error during admin login:", error);
    return res
      .status(500)
      .json({ status: 500, error: "Internal Server Error" });
  }
}

async function createAdmin(req, res, next) {
  try {
    // Authorization check
    // if (!req.admin.isAdmin) {
    //   return res
    //     .status(403)
    //     .json({ error: "Forbidden: Only admins can create new admins" });
    // }

    const { username, password } = req.body;

    // Validate the input
    if (!username || !password) {
      return res.status(400).json({
        status: 400,
        error: "Username and password are required fields.",
      });
    }

    // Hash the password before storing it in the database
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newAdmin = await AdminModel.create({
      username,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json({ status: 201, message: "Admin created successfully" });
  } catch (error) {
    logger().error("Error creating admin:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Implement other admin CRUD operations as needed

module.exports = {
  getAllAdmins,
  loginAdmin,
  createAdmin,
  // Add other admin functions
};
