import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const BANNER_KEY = "app:banner"

app.post("/banner", async (req, res) => {
    const { content } = req.body;
    await redis.set(BANNER_KEY, content || "Welcome to our site!");
    res.json({ message: "Banner updated successfully" });
});

app.get("/banner", async (req, res) => {
    const bannerContent = await redis.get(BANNER_KEY);
    res.json({ banner: bannerContent || "Welcome to our site!" });
});

app.delete("/banner", async (req, res) => {
    await redis.del(BANNER_KEY);
    res.json({ message: "Banner deleted successfully" });
});

app.get("/banner/exist", async (req, res) => {
    const exists = await redis.exists(BANNER_KEY);
    res.json({ exists: Boolean(exists) });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});