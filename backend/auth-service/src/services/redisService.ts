import redis from '../config/redis.js';

class RedisService {
  async storeOTP(phone: string, otp: string, expiresInSeconds: number = 300): Promise<void> {
    await redis.setex(`otp:${phone}`, expiresInSeconds, otp);
  }

  async verifyOTP(phone: string, otp: string): Promise<boolean> {
    const storedOtp = await redis.get(`otp:${phone}`);
    return storedOtp === otp;
  }

  async deleteOTP(phone: string): Promise<void> {
    await redis.del(`otp:${phone}`);
  }

  async storeSession(userId: string, token: string, expiresInSeconds: number = 30 * 24 * 60 * 60): Promise<void> {
    await redis.setex(`session:${userId}`, expiresInSeconds, token);
  }

  async getSession(userId: string): Promise<string | null> {
    return await redis.get(`session:${userId}`);
  }

  async deleteSession(userId: string): Promise<void> {
    await redis.del(`session:${userId}`);
  }

  async isRateLimited(phone: string, limit: number = 3, windowSeconds: number = 300): Promise<boolean> {
    const key = `ratelimit:${phone}`;
    const attempts = await redis.incr(key);
    if (attempts === 1) await redis.expire(key, windowSeconds);
    return attempts > limit;
  }
}

export default new RedisService();