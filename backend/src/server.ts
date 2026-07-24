import dotenv from "dotenv";
dotenv.config();

import dns from "node:dns/promises";

// Workaround for local DNS environments where SRV records
// for MongoDB Atlas are not resolved correctly.
dns.setServers(["1.1.1.1", "1.0.0.1"]);

import app from "./app.js";
import logger from "./config/logger.js";
import connectDb from "./config/db.js";

const PORT = process.env.PORT || 5000;

async function init() {
  await connectDb();

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

init();
