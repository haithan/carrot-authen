const { createLogger, format, transports } = require("winston");
const expressWinston = require("express-winston");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "auth-service" },
  transports: [
    // new transports.File({ filename: "quick-start-error.log", level: "error" }),
    // new transports.File({ filename: "quick-start-combined.log" }),
    new transports.Console(),
  ],
});

const exp = expressWinston.logger({ winstonInstance: logger });
module.exports = exp;
