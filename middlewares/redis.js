const { createClient } = require("redis");
const hash = require("object-hash");

let redisClient = null;

// Redis cache middleware function
function redisCacheMiddleware(
  options = {
    EX: 21600, // 6h
  }
) {
  return async (req, res, next) => {
    if (isRedisWorking()) {
      const key = requestToKey(req);
      // if there is some cached data, retrieve it and return it
      const cachedValue = await readData(key);
      if (cachedValue) {
        try {
            console.log('Cache hit for key:', key);
          // if it is JSON data, then return it
          return res.json(JSON.parse(cachedValue));
        } catch {
          // if it is not JSON data, then return it
          return res.send(cachedValue);
        }
      } else {
        // override how res.send behaves
        // to introduce the caching logic
        const oldSend = res.send;
        res.send = function (data) {
          // set the function back to avoid the 'double-send' effect
          res.send = oldSend;

          // cache the response only if it is successful
          if (res.statusCode.toString().startsWith("2")) {
            writeData(key, data, options).then();
          }

          return res.send(data);
        };

        // continue to the controller function
        next();
      }
    } else {
      // proceed with no caching
      next();
    }
  };
}
async function initializeRedisClient() {
  if (redisClient?.isReady) {
    console.log('Redis client already initialized');
    return redisClient;
  }

  try {
    console.log('Attempting to create Redis client...');
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
      socket: {
        reconnectStrategy: (retries) => {
          console.log(`Redis retry attempt ${retries}`);
          if (retries > 10) {
            console.log('Too many retries on Redis. Running without cache.');
            return false;
          }
          return Math.min(retries * 100, 3000);
        },
      }
    });

    // Add more detailed event listeners
    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Redis Client Connected');
    });

    redisClient.on('ready', () => {
      console.log('Redis Client Ready');
    });

    console.log('Attempting to connect to Redis...');
    await redisClient.connect();
    console.log('Redis connection successful');
    return redisClient;
  } catch (error) {
    console.error('Redis initialization failed:', error);
    console.error('Full error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    redisClient = null;
    return null;
  }
}  

async function writeData(key, data, options) {
  if (isRedisWorking()) {
    try {
      // Ensure data is stringified before caching
      const stringifiedData = typeof data === 'string' ? data : JSON.stringify(data);
      await redisClient.set(key, stringifiedData, options);
    } catch (e) {
      console.error(`Failed to cache data for key=${key}`, e);
    }
  }
}
async function readData(key) {
  let cachedValue = undefined;

  if (isRedisWorking()) {
    // try to get the cached response from redis
    cachedValue = await redisClient.get(key);
    if (cachedValue) {
        return cachedValue;
    }
  }
}
// options:
// {
//     EX, // the specified expire time in seconds
//     PX, // the specified expire time in milliseconds
//     EXAT, // the specified Unix time at which the key will expire, in seconds
//     PXAT, // the specified Unix time at which the key will expire, in milliseconds
//     NX, // write the data only if the key does not already exist
//     XX, // write the data only if the key already exists
//     KEEPTTL, // retain the TTL associated with the key
//     GET, // return the old string stored at key, or "undefined" if key did not exist
// }

function requestToKey(req) {
  // build a custom object to use as part of the Redis key
  const reqDataToHash = {
    query: req.query,
    body: req.body,
  };

  // `${req.path}@...` to make it easier to find
  // keys on a Redis client
  return `${req.path}@${hash.sha1(reqDataToHash)}`;
}

// verify whether the Redis client's underlying socket is open or not.
function isRedisWorking() {
  // verify wheter there is an active connection
  // to a Redis server or not
  return !!redisClient?.isOpen;
}

module.exports = {
  initializeRedisClient,
  getRedisClient: () => redisClient,
  redisCacheMiddleware
};