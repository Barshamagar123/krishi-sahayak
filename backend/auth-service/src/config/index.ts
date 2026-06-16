import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001'),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL || ''
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  },
  
  otp: {
    expirySeconds: 300,
    length: 6,
    rateLimit: 3
  }
};