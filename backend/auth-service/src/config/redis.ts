import Redis from 'ioredis';
import { config } from './index.js';

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password || undefined,
  retryStrategy: (times: number) => Math.min(times * 50, 2000)
});

redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('error', (err: Error) => console.error('❌ Redis error:', err));

export default redis;