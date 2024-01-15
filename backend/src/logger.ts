import winston from "winston";

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "test" ? "no-log" : "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export default logger;
