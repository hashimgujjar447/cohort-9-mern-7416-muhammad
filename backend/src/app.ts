import express from "express";
import { pinoHttp } from "pino-http";
import logger from "./config/logger.js";
import helmet from "helmet";
import cookieParser from "cookie-parser";

const app = express();

app.use(helmet());
app.use(cookieParser());

app.use(pinoHttp({ logger }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Api is working" });
});

export default app;
