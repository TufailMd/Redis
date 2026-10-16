import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(
    process.env.REDIS_URL || "redis://localhost:6379"
);
const QUEUE_NAME = "queue:email";   // queue ka key

app.post("/emails", async (req, res) => {
  const job = {
    to: req.body.to,
    subject: req.body.subject || "No Subject",
    body: req.body.body,
    createdAt: new Date().toISOString(),
  };

  await redis.lpush(QUEUE_NAME, JSON.stringify(job));   // left se push

  res.json({ queued: true, job });
});

app.get("/emails/process", async (req, res) => {
  const rawJob = await redis.rpop(QUEUE_NAME);   // right se pop

  if (!rawJob) {
    return res.json({ message: "No jobs in queue" });
  }

  const job = JSON.parse(rawJob);                // string -> object

  // yahan email bhejne ka kaam simulate karo (console.log etc.)
  console.log("Sending email to", job.to);

  res.json({ message: "Email sent", job });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));