import express, { Request, Response } from "express";
import { pinoHttp } from "pino-http";
import logger from "./config/logger.js";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import AuthRouter from "./modules/auth/auth.routes.js";
import NoteRouter from "./modules/notes/notes.routes.js";
import chatRouter from "./modules/chat/chat.routes.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import cors from "cors";

const app = express();
app.set("etag", false);

if (!process.env.CLIENT_URL) {
  throw new Error("CLIENT_URL environment variable is required");
}

try {
  new URL(process.env.CLIENT_URL);
} catch {
  throw new Error("CLIENT_URL must be a valid URL");
}

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(helmet());
app.use(cookieParser());

app.use(pinoHttp({ logger }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/note", NoteRouter);
app.use("/api/v1/chat", chatRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Api is working" });
});

app.use(globalErrorHandler);

export default app;
