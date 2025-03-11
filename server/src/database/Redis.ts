import Redis from 'ioredis'

const redis = new Redis({
    host: process.env['DB_HOST'],
    port: process.env['REDIS_PORT'],
    password: process.env['REDIS_PASS'],
    db: 0
})
redis.on('error', (err) => {
    console.error('Redis Error:', err)
})
export default redis