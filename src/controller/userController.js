// userController.js

const { UserModel } = require("../models");
const { logger } = require("../utils/logger");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Get all users
async function getAllUsers(req, res, next) {
  try {
    logger().info("user is", req.user.userName);
    // Check if the requesting user is an admin
    if (req.user.userName !== "Admin") {
      return res.status(403).json({
        status: 403,
        error: "Forbidden: Only admin users can access this route",
      });
    }

    logger().info("req is", req);

    const users = await UserModel.findAll();
    return res.status(200).json(users);
  } catch (error) {
    logger().error("Error in getting all users", error);
    next(error);
  }
}

// Create a new user
async function createUser(req, res, next) {
  const { name, email, username, password } = req.body;

  try {
    // Validate the input
    if ((!name || !email) && (!username || !password)) {
      return res.status(400).json({
        status: 400,
        error: "Name and email OR username and password are required fields.",
      });
    }
    let hashedPassword;
    if (password) {
      hashedPassword = bcrypt.hashSync(password, 10);
    }
    if (username && !password) {
      return res.status(400).json({
        status: 400,
        error: "Password is required",
      });
    }

    // Create the user based on input
    const newUser = await UserModel.create({
      name,
      email,
      userName: username || null, // Use null if username is not provided
      password: hashedPassword || null, // Use null if password is not provided
      isAuthUser: !!username && !!password, // Set isAuthUser to true if both username and password are provided
    });

    return res.status(201).json(newUser);
  } catch (error) {
    logger().error("Error in creating a user", error);
    next(error);
  }
}

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ where: { userName: username } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res
        .status(401)
        .json({ status: 400, error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, "shshs", {
      expiresIn: "2h",
    });

    return res.status(200).json({
      status: 200,
      message: "User LoggedIn Successfully!",
      token: token,
    });
  } catch (error) {
    logger().error("Error during admin login:", error);
    return res
      .status(500)
      .json({ status: 500, error: "Internal Server Error" });
  }
}
module.exports = {
  getAllUsers,
  createUser,
  loginUser,
};
