import { Redis } from 'ioredis'

const RedisClient = new Redis({
    host: process.env['DB_HOST']!,
    password: process.env['REDIS_PASS']!
})
export default RedisClient