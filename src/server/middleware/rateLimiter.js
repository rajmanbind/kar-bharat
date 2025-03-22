
const { RateLimiterRedis } = require('rate-limiter-flexible');
const redisClient = require('../config/redis');

// Create a rate limiter instance
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rate_limit',
  points: 60, // Number of requests
  duration: 60, // Per minute
});

// Rate limiting middleware
const rateLimiterMiddleware = async (req, res, next) => {
  try {
    // Use IP as key for rate limiting
    const key = req.ip;
    await rateLimiter.consume(key);
    next();
  } catch (err) {
    res.status(429).json({
      message: 'Too many requests. Please try again later.',
    });
  }
};

module.exports = rateLimiterMiddleware;
