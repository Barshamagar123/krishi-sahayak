import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3002'),
  nodeEnv: process.env.NODE_ENV || 'development',

  database: {
    url: process.env.DATABASE_URL || ''
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret'
  },

  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://krishi_user:krishi_pass123@rabbitmq:5672'
  }
};