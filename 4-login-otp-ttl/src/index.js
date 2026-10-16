import express from 'express';
import Redis from 'ioredis';

const app = express();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.use(express.json());

function otpKey(phoneNumber) {
    return `otp:${phoneNumber}`;
}

app.post('/otp', async (req, res) => {
    const { phoneNumber } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

    // Store OTP in Redis with a TTL of 5 minutes (300 seconds)
    await redis.set(otpKey(phoneNumber), otp, 'EX', 30);

    res.json({ message: 'OTP sent successfully', otp }); // In a real application, you would send the OTP via SMS
});

app.post('/verify-otp', async (req, res) => {
    const { phoneNumber, otp } = req.body;
    const storedOtp = await redis.get(otpKey(phoneNumber));

    if(!storedOtp) {
        return res.status(400).json({ message: 'OTP has expired or does not exist' });
    }

    if(storedOtp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    await redis.del(otpKey(phoneNumber));
    res.json({ message: 'OTP verified successfully' });
});

app.get('/otp/:phone/ttl', async (req, res) => {
    const ttl = await redis.ttl(otpKey(req.params.phone));

    res.json({ ttl });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
