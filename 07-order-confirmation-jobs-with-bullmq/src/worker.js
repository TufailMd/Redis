import { Worker } from "bullmq";
import { connection } from "./queue.js";

const emailWorker = new Worker(
  "email",                              // 1) kaun si queue se data uthana hai
  async (job) => {                      // 2) business logic (callback)
    console.log("Processing email job", job.id, job.name, job.data);

    // yahan asli kaam hota hai (Resend/Zoho/SES se email bhejna etc.)
    await new Promise((resolve) => setTimeout(resolve, 1500));   // 1.5 sec ka fake delay

    console.log("Email job completed", job.id);
  },
  { connection }                        // 3) Redis connection
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed:`, err.message);
});