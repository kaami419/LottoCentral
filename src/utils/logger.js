const log4js = require("log4js");

let customLogger;

const setupLogger = (user) => {
  log4js.configure({
    appenders: {
      out: {
        type: "stdout",
        layout: {
          type: "pattern",
          pattern: "%[ %d %z %p %x{user} %l %f{4} %m %] %n",
          tokens: {
            user: function () {
              return user || "SYSTEM";
            },
          },
        },
      },
    },
    categories: {
      default: { appenders: ["out"], level: "info", enableCallStack: true },
    },
  });
  customLogger = log4js.getLogger();
  customLogger.level = "debug";
  return customLogger;
};

const logger = () => customLogger || setupLogger();

module.exports = {
  setupLogger,
  logger,
};
