import * as redis from 'redis';

let redisClient = redis.createClient({
    socket: {
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
    },
  });

redisClient.on("connected", (data)=> console.log ("Redis connected"))
redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.on('ready', (data) => console.log('Redis is running'));

await redisClient.connect();

export default redisClient;