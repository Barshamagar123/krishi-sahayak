import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import rabbitMQ from './services/rabbitmq.js';
import userConsumer from './consumers/userConsumer.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import userController from './controllers/userController.js';
import profileController from './controllers/profileController.js';
import cropController from './controllers/cropController.js'; 
import { uploadSingle } from './middleware/uploadMiddleware.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3002');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ✅ Serve static images from uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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
      // Health
      'GET /health': 'Health check',
      
      // User endpoints
      'GET /users/me': 'Get user profile',
      'PUT /users/me': 'Update user profile',
      'PUT /users/language': 'Update language preference',
      'DELETE /users/me': 'Deactivate account',
      'POST /users/reactivate': 'Reactivate account',
      'GET /users/by-district/:district': 'Get users by district',
      
      // Profile endpoints
      'GET /profile/me': 'Get full profile with preferences',
      'PUT /profile/me': 'Update profile',
      'PUT /profile/language': 'Update language',
      'DELETE /profile/me': 'Deactivate account',
      'POST /profile/reactivate': 'Reactivate account',
      
      // Preference endpoints
      'GET /profile/preferences': 'Get crop preferences',
      'POST /profile/preferences': 'Add crop preference',
      'DELETE /profile/preferences/:cropId': 'Remove crop preference',
      
      // ✅ CROP ENDPOINTS
      'GET /crops': 'Get all crops',
      'GET /crops/:id': 'Get crop by ID',
      'GET /crops/season/:season': 'Get crops by season',
      'GET /crops/search': 'Search crops',
      'POST /crops': 'Create crop (Admin)',
      'PUT /crops/:id': 'Update crop (Admin)',
      'DELETE /crops/:id': 'Delete crop (Admin)',
      'GET /crops/admin/all': 'Get all crops including inactive (Admin)'
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

// ==================== CROP ROUTES ====================
// Public routes (authenticated users can view)
app.get('/crops', authMiddleware, cropController.getAllCrops.bind(cropController));
app.get('/crops/:id', authMiddleware, cropController.getCropById.bind(cropController));
app.get('/crops/season/:season', authMiddleware, cropController.getCropsBySeason.bind(cropController));
app.get('/crops/search', authMiddleware, cropController.searchCrops.bind(cropController));

// Admin routes (with image upload)
app.post('/crops', authMiddleware, uploadSingle, cropController.createCrop.bind(cropController));
app.put('/crops/:id', authMiddleware, uploadSingle, cropController.updateCrop.bind(cropController));
app.delete('/crops/:id', authMiddleware, cropController.deleteCrop.bind(cropController));
app.get('/crops/admin/all', authMiddleware, cropController.getAllCropsAdmin.bind(cropController));

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
      console.log(`🌾 Crop routes added`);
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