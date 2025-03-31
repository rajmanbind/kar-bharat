
const redisClient = require('../config/redis');

// Cache duration in seconds
const CACHE_DURATION = 300; // 5 minutes

/**
 * API response caching middleware
 * @param {number} duration - Cache duration in seconds
 */
const cache = (duration = CACHE_DURATION) => {
  return async (req, res, next) => {
    // Skip cache for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Create a cache key from the request URL
    const key = `api:${req.originalUrl}`;

    try {
      // Try to get the cached response
      const cachedResponse = await redisClient.get(key);

      if (cachedResponse) {
        // Return cached response
        return res.json(JSON.parse(cachedResponse));
      }

      // Store the original send function
      const originalSend = res.json;

      // Override the json method
      res.json = function (body) {
        // Cache the response
        redisClient.set(key, JSON.stringify(body), {
          EX: duration,
        });
        
        // Call the original json method
        return originalSend.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

module.exports = cache;
