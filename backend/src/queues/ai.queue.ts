import { Queue } from "bullmq";

import { redisConnection } from "../config/redis.js";

export const aiQueue = new Queue("ai-ingestion", {
  connection: redisConnection,

  defaultJobOptions: {
    attempts: 5,

    backoff: {
      type: "exponential",
      delay: 10000,
    },

    removeOnComplete: 100,
    removeOnFail: 500,
  },
});
