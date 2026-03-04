import winston from "winston";

// Logger configuration
const logger = winston.createLogger({
  level: "info", // Default log level
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp to logs
    winston.format.simple() // Simple log format (timestamp + message)
  ),
  transports: [
    // Log to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Colorizing the console logs
        winston.format.simple() // Simple format
      ),
    }),
    // Log to file
    new winston.transports.File({ filename: "app.log" }), // Logs will be saved to app.log
  ],
});

export default logger;