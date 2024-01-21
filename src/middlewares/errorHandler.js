// src/middleware/errorHandler.js

const { logger } = require("../utils/logger");

function errorHandler(err, req, res, next) {
  // Log the error
  logger().error(err);

  // Set a default status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Send the error response
  res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
