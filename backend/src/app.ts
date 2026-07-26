import express, { Request, Response } from "express";
import { pinoHttp } from "pino-http";
import logger from "./config/logger.js";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import AuthRouter from "./modules/auth/auth.routes.js";
import NoteRouter from "./modules/notes/notes.routes.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";

const app = express();

app.use(helmet());
app.use(cookieParser());

app.use(pinoHttp({ logger }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/note", NoteRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Api is working" });
});

app.use(globalErrorHandler);

export default app;
