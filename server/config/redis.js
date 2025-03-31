import { createClient } from "redis";
import { REDIS_URL } from "./env.js";

// Create Redis client
const redisClient = createClient({
  url: REDIS_URL,
});

// Handle Redis connection
(async () => {
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  await redisClient.connect().catch(console.error);
  console.log("Redis client connected");
})();

export default redisClient;
