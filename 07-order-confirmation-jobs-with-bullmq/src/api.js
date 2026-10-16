import express from "express";
import { emailQueue } from "./queue.js";

const app = express();
app.use(express.json());

app.post("/welcome-email", async (req, res) => {
  const job = await emailQueue.add(
    "send-welcome-email",           // job ka naam (spaces ki jagah dash/kebab-case)
    {                               // job ka data
      to: req.body.to,
      name: req.body.name || "Learner",
    },
    {                               // job config
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 },
    }
  );

  res.json({ message: "Email added to queue", jobId: job.id });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));