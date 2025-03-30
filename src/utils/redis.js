import Redis from "ioredis"
import { config } from "../config/config.js"

const redis = new Redis({
  host: config.redisHost,
  port: config.redisPort,
  password: config.redisPassword
});



redis.on("error", (err) => {
  console.log(err);
});

redis.on("ready", () => {
  console.log("Redis ready");
});

redis.on("close", () => {
  console.log("Redis connection closed");
});

redis.on("reconnecting", () => {
  console.log("Redis reconnecting");
});

redis.on("end", () => {
  console.log("Redis connection ended");
});




export default redis;



