
import express from "express";
import Redis from "ioredis";

const app = express();
const redis = new Redis(
    process.env.REDIS_URL || "redis://localhost:6379"
);

// Parse JSON request bodies
app.use(express.json());

// Save user data as a JSON string
app.post("/user/:id/json", async (req, res) => {
    try {
        await redis.set(
            `user:${req.params.id}:json`,
            JSON.stringify(req.body)
        );

        res.json({ savedAs: "json" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve JSON data
app.get("/user/:id/json", async (req, res) => {
    try {
        const raw = await redis.get(
            `user:${req.params.id}:json`
        );

        res.json({
            data: raw ? JSON.parse(raw) : null
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Save user data as a Redis Hash
app.post("/user/:id/hash", async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: "Request body cannot be empty"
            });
        }

        await redis.hset(
            `user:${req.params.id}:hash`,
            req.body
        );

        res.json({ savedAs: "hash" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve Hash data
app.get("/user/:id/hash", async (req, res) => {
    try {
        const user = await redis.hgetall(
            `user:${req.params.id}:hash`
        );

        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
