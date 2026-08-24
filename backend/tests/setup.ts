import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { aiQueue } from "../src/queues/ai.queue.js";

let mongoServer: MongoMemoryServer;

before(async function () {
  this.timeout(10000);

  mongoServer = await MongoMemoryServer.create();

  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

after(async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    await aiQueue.close();
  } finally {
    await mongoServer.stop();
  }
});

