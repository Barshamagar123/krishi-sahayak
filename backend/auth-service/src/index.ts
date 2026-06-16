import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authController from './controllers/authController.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import { limiter } from './middleware/rateLimiter.js';
import { validateSendOTP, validateVerifyOTP } from './middleware/validationMiddleware.js';
import rabbitMQ from './services/rabbitmq.js'; // ✅ ADD THIS

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(limiter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'auth-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Public routes
app.post('/auth/send-otp', validateSendOTP, authController.sendOTP.bind(authController));
app.post('/auth/verify-otp', validateVerifyOTP, authController.verifyOTP.bind(authController));

// Protected routes
app.get('/auth/me', authMiddleware, authController.getMe.bind(authController));
app.post('/auth/logout', authMiddleware, authController.logout.bind(authController));

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'Krishi Sahayak Auth Service',
    version: '1.0.0',
    endpoints: {
      'POST /auth/send-otp': 'Send OTP to phone',
      'POST /auth/verify-otp': 'Verify OTP and login',
      'GET /auth/me': 'Get user info (requires token)',
      'POST /auth/logout': 'Logout (requires token)',
      'GET /health': 'Health check'
    }
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ✅ START SERVER WITH RABBITMQ (REPLACE THE OLD app.listen)
const startServer = async () => {
  try {
    // Connect to RabbitMQ
    await rabbitMQ.connect();
    
    // Start Express server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n${'='.repeat(50)}`);
      console.log(`🔐 KRISHI SAHAYAK - AUTH SERVICE`);
      console.log(`${'='.repeat(50)}`);
      console.log(`✅ Server running on: http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🐇 RabbitMQ connected`);
      console.log(`${'='.repeat(50)}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// ✅ CALL THE ASYNC START FUNCTION
startServer();

// ✅ GRACEFUL SHUTDOWN (ADD THIS)
process.on('SIGTERM', async () => {
  console.log('🔴 SIGTERM received, shutting down gracefully...');
  await rabbitMQ.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔴 SIGINT received, shutting down gracefully...');
  await rabbitMQ.close();
  process.exit(0);
});

export default app;