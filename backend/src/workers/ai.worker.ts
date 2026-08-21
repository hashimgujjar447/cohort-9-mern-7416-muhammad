import { Worker } from "bullmq";

import { redisConnection } from "../config/redis.js";

import {
  ingestNoteToAI,
  updateIngestNoteToAI,
  deleteIngestNoteEmbeddings,
} from "../services/ai.service.js";

export const aiWorker = new Worker(
  "ai-ingestion",

  async (job) => {
    console.log(`Processing AI job: ${job.id} - ${job.name}`);

    switch (job.name) {
      case "ingest-note":
        await ingestNoteToAI(job.data);
        break;

      case "update-note":
        await updateIngestNoteToAI(job.data);
        break;

      case "delete-note":
        await deleteIngestNoteEmbeddings(job.data);
        break;

      default:
        throw new Error(`Unknown AI job: ${job.name}`);
    }

    console.log(`AI job completed: ${job.id} - ${job.name}`);
  },

  {
    connection: redisConnection,
  },
);

aiWorker.on("completed", (job) => {
  console.log(`AI job ${job.id} completed successfully`);
});

aiWorker.on("failed", (job, error) => {
  console.error(
    `AI job ${job?.id} failed`,
    `Attempt ${job?.attemptsMade}/${job?.opts.attempts}:`,
    error.message,
  );
});
