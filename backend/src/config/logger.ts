import "./env.js";
import pino from "pino";
const isDevelopment = process.env.NODE_ENV === "development";

const allowedLevels = [
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
  "silent",
] as const;

type LogLevel = (typeof allowedLevels)[number];

const envLevel = process.env.LOG_LEVEL;
const logLevel: LogLevel = allowedLevels.includes(envLevel as LogLevel)
  ? (envLevel as LogLevel)
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
