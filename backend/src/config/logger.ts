import "./env.js";
import pino from "pino";
const isDevelopment = process.env.NODE_ENV !== "production";

const allowedLevels = [
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
  "silent",
] as const;

const logLevel = allowedLevels.includes(process.env.LOG_LEVEL as any)
  ? process.env.LOG_LEVEL
  : "info";

const logger = pino({
  level: logLevel,
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,
});
export default logger;
