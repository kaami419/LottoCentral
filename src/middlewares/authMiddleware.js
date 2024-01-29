// src/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const { UserModel } = require("../models");
const { logger } = require("../utils/logger");
require("dotenv").config();

const authenticate = async (req, res, next) => {
  const tokenHeader = req.headers["authorization"];
  const token = tokenHeader && tokenHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ status: 401, error: "Unauthorized: Missing token" });
  }

  try {
    const decoded = jwt.verify(token, "shshs");
    logger().info("Decoded Token:", decoded);

    const user = await UserModel.findOne({
      where: { id: decoded.id },
      attributes: [
        "id",
        "name",
        "email",
        "userName",
        "isAuthUser",
        "enable",
        "deleted",
      ],
    });

    // logger().info("current user is", user);

    if (!user) {
      return res
        .status(401)
        .json({ status: 401, error: "Unauthorized: Invalid token" });
    }

    req.user = {
      id: user.id,
      userName: user.userName,
      name: user.name,
      email: user.email,
      isAuthUser: user.isAuthUser,
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = { authenticate };
