import IORedis from 'ioredis';

const sharedConnection = new IORedis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: null,
});

const redisConfig = {
  connection: sharedConnection,
  concurrency: 100,
};

export default redisConfig