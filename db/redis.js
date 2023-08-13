import * as redis from 'redis';
import dotenv from 'dotenv';
dotenv.config();


let redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
  });

redisClient.on("connected", (data)=> console.log ("Redis connected"))
redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.on('ready', (data) => console.log('Redis is running'));

await redisClient.connect();

export default redisClient;