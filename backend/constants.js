const REDIS = {
  HOST: process.env.REDIS_HOST || "127.0.0.1",
  PORT: process.env.REDIS_PORT || 6379,
};

const PORT = process.env.PORT || 4000;

module.exports = {
  REDIS,
  PORT,
};
