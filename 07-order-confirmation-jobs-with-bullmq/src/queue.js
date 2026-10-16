import { Queue } from "bullmq";
import Redis from "ioredis";

// Connection: wahi Redis jo Docker Compose se chal raha hai
const connection = new Redis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null,   // Extra: BullMQ worker ke liye zaroori
});

// Queue banane ke liye bas 2 cheezein: naam + connection
const emailQueue = new Queue("email", { connection });

module.exports = { emailQueue, connection };