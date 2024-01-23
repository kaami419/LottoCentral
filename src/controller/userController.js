// userController.js

const { UserModel } = require("../models");
const { logger } = require("../utils/logger");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Get all users
async function getAllUsers(req, res, next) {
  try {
    logger().info("Getting All Users");
    // Check if the requesting user is an admin
    if (req.user.userName.toLowerCase() !== "admin") {
      return res.status(403).json({
        status: 403,
        error: "Forbidden: Only admin users can access this route",
      });
    }

    logger().info("req is", req);

    const users = await UserModel.findAll({
      where: {
        enable: true,
        deleted: false,
      },
    });
    return res.status(200).json({
      status: 200,
      message: "users fetched successfully",
      data: users,
    });
  } catch (error) {
    logger().error("Error in getting all users", error);
    next(error);
  }
}

// Create a new user
async function createUser(req, res, next) {
  const { name, email, username, password } = req.body;

  try {
    logger().info("creating a user");
    // Validate the input
    if (!name || !email || !username || !password) {
      return res.status(400).json({
        status: 400,
        error: "Email, name, username and password are required.",
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
      name: name,
      email: email,
      userName: username,
      password: hashedPassword,
      isAuthUser: !!username && !!password,
    });

    return res.status(200).json({
      status: 200,
      message: "User Created Successfully",
      data: newUser,
    });
  } catch (error) {
    logger().error("Error in creating a user", error);
    next(error);
  }
}

//  login user
async function loginUser(req, res, next) {
  logger().info("user logging in ");
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({
      where: { userName: username, enable: true, deleted: false },
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res
        .status(401)
        .json({ status: 400, error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, "shshs", {
      expiresIn: "8h",
    });

    logger().info("user logging in successfully ");
    return res.status(200).json({
      status: 200,
      message: "User LoggedIn Successfully!",
      token: token,
    });
  } catch (error) {
    logger().error("Error during user login:", error);
    return next(error);
  }
}

// Update a user
async function updateUser(req, res, next) {
  const userId = req.user.id;
  const { name, email, username, password } = req.body;

  try {
    const user = await UserModel.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        status: 404,
        error: "User not found",
      });
    }

    // Update user attributes based on input
    user.name = name || user.name;
    user.email = email || user.email;
    user.userName = username || user.userName;

    if (password) {
      user.password = bcrypt.hashSync(password, 10);
    }

    await user.save();

    return res.status(200).json({
      status: 200,
      message: "User updated successfully!",
      user: user,
    });
  } catch (error) {
    logger().error("Error in updating user", error);
    next(error);
  }
}

// Delete a user
async function deleteUser(req, res, next) {
  const userId = req.user.id;

  try {
    const user = await UserModel.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        status: 404,
        error: "User not found",
      });
    }

    await user.update({
      enable: false,
      deleted: true,
    });

    return res.status(200).json({
      status: 200,
      message: "User deleted successfully!",
    });
  } catch (error) {
    logger().error("Error in deleting user", error);
    next(error);
  }
}

async function getSingleUser(req, res, next) {
  const userId = req.query.id;

  try {
    const user = await UserModel.findOne({
      where: { id: userId, enable: true, deleted: false },
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        error: "User not found",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "User fetched successfully!",
      data: user,
    });
  } catch (error) {
    logger().error("Error in fetching single user", error);
    next(error);
  }
}
module.exports = {
  getAllUsers,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getSingleUser,
};
