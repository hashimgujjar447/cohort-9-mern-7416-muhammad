import dotenv from "dotenv";
dotenv.config();

import dns from "node:dns/promises";

if (process.env.NODE_ENV === "development") {
  dns.setServers(["1.1.1.1", "1.0.0.1"]);
}

import app from "./app.js";
import logger from "./config/logger.js";
import connectDb from "./config/db.js";

const port = Number(process.env.PORT);
const PORT = Number.isInteger(port) && port > 0 ? port : 5000;

async function init() {
  try {
    await connectDb();

    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });

    server.on("error", (err: Error) => {
      logger.error(err);
      process.exit(1);
    });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err);
    } else {
      logger.error("Unknown startup error");
    }

    process.exit(1);
  }
}

init();
