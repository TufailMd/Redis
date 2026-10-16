import Redis from 'ioredis';

const subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

subscriber.subscriber('notifications', (err, message) => {
  if (err) {
    console.error('Error receiving message:', err);
    return;
  }
  console.log('Received notification:', message);
});

subscriber.on("message", (channel, message) => {
  console.log(`Received message from channel ${channel}: ${JSON.parse(message)}`);
});

export default subscriber;