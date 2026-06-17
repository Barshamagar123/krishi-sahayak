import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rabbitMQ from './services/rabbitmq.js';
import userConsumer from './consumers/userConsumer.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import userController from './controllers/userController.js';
import profileController from './controllers/profileController.js';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3002');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'user-service',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'Krishi Sahayak - User Service',
    version: '1.0.0',
    endpoints: {
      'GET /health': 'Health check',
      'GET /users/me': 'Get user profile',
      'PUT /users/me': 'Update user profile',
      'PUT /users/language': 'Update language preference',
      'DELETE /users/me': 'Deactivate account',
      'POST /users/reactivate': 'Reactivate account',
      'GET /users/by-district/:district': 'Get users by district',
      'GET /profile/me': 'Get full profile with preferences',
      'PUT /profile/me': 'Update profile',
      'PUT /profile/language': 'Update language',
      'DELETE /profile/me': 'Deactivate account',
      'POST /profile/reactivate': 'Reactivate account',
      'GET /profile/preferences': 'Get crop preferences',
      'POST /profile/preferences': 'Add crop preference',
      'DELETE /profile/preferences/:cropId': 'Remove crop preference'
    }
  });
});

// ==================== USER ROUTES ====================
app.get('/users/me', authMiddleware, userController.getProfile.bind(userController));
app.put('/users/me', authMiddleware, userController.updateProfile.bind(userController));
app.put('/users/language', authMiddleware, userController.updateLanguage.bind(userController));
app.delete('/users/me', authMiddleware, userController.deactivateAccount.bind(userController));
app.post('/users/reactivate', authMiddleware, userController.reactivateAccount.bind(userController));
app.get('/users/by-district/:district', authMiddleware, userController.getUsersByDistrict.bind(userController));

// ==================== PROFILE ROUTES ====================
app.get('/profile/me', authMiddleware, profileController.getProfile.bind(profileController));
app.put('/profile/me', authMiddleware, profileController.updateProfile.bind(profileController));
app.put('/profile/language', authMiddleware, profileController.updateLanguage.bind(profileController));
app.delete('/profile/me', authMiddleware, profileController.deactivateAccount.bind(profileController));
app.post('/profile/reactivate', authMiddleware, profileController.reactivateAccount.bind(profileController));
app.get('/profile/preferences', authMiddleware, profileController.getCropPreferences.bind(profileController));
app.post('/profile/preferences', authMiddleware, profileController.addCropPreference.bind(profileController));
app.delete('/profile/preferences/:cropId', authMiddleware, profileController.removeCropPreference.bind(profileController));

// ==================== START SERVER ====================
const startServer = async () => {
  try {
    await rabbitMQ.connect();
    await userConsumer.start();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n${'='.repeat(50)}`);
      console.log(`👤 KRISHI SAHAYAK - USER SERVICE`);
      console.log(`${'='.repeat(50)}`);
      console.log(`✅ Server running on: http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
      console.log(`🐇 RabbitMQ connected`);
      console.log(`${'='.repeat(50)}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// ==================== GRACEFUL SHUTDOWN ====================
process.on('SIGTERM', async () => {
  console.log('🔴 SIGTERM received, shutting down...');
  await rabbitMQ.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔴 SIGINT received, shutting down...');
  await rabbitMQ.close();
  process.exit(0);
});

export default app;