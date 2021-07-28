const Redis = require("ioredis");
const { REDIS } = require("./constants");
let redis;

const initializeRedis = async () => {
  return new Promise((resolve, reject) => {
    let client = new Redis({
      host: REDIS.HOST,
      port: REDIS.PORT,
    });
    client.on("ready", () => {
      redis = client;
      resolve();
    });
    client.on("error", (error) => {
      console.log("redis error", error);
      redis = null;
      reject();
    });
  });
};

/**
 * default expire time for a key is 10 mins
 */
const setRedisKey = async ({ key, data, expiration = 600 }) => {
  if (!redis) {
    await initializeRedis();
  }
  return redis.set(key, data, "ex", expiration);
};

const getRedisKey = async ({ key }) => {
  if (!redis) {
    await initializeRedis();
  }
  return redis.get(key);
};

module.exports = {
  setRedisKey,
  getRedisKey,
};
