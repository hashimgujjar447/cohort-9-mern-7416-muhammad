import { Worker, UnrecoverableError } from "bullmq";

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

    try {
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
          throw new UnrecoverableError(`Unknown AI job: ${job.name}`);
      }
    } catch (error) {
      console.error(`AI job ${job.id} - ${job.name} failed:`, error);
      throw error;
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
