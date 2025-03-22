
const { createClient } = require('redis');
const dotenv = require('dotenv');

dotenv.config();

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

// Handle Redis connection
(async () => {
  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  await redisClient.connect().catch(console.error);
  console.log('Redis client connected');
})();

module.exports = redisClient;
