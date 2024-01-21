require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./src/database");
const routes = require("./src/routes");
const { logger } = require("./src/utils/logger");
const errorHandler = require("./src/middlewares/errorHandler");
const lotteryScheduler = require("./src/controller/lotteryScheduler"); // Import the lotteryScheduler
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Establish a connection to the database
db.sequelize
  .authenticate()
  .then(() => {
    logger().info(
      "Connection to the database has been established successfully."
    );
  })
  .catch((error) => {
    logger().error("Unable to connect to the database:", error);
  });

// Sync your models with the database
db.sequelize.sync().then(() => {
  logger().info("Database Connection Established Successfully");
});

app.use("/dev", routes);

app.use(errorHandler);

// Scheduler for every night at midnight
// lotteryScheduler.start();

app.listen(port, () => {
  logger().info(`Server is running on port ${port}`);
});
