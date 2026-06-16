import { Request, Response } from 'express';
import prisma from '../config/database.js';
import jwtService from '../services/jwtService.js';
import otpService from '../services/otpService.js';
import redisService from '../services/redisService.js';
import { SendOtpRequest, VerifyOtpRequest, AuthResponse } from '../types/index.js';

export class AuthController {
  // ✅ FIXED: Now accepts email parameter
  async sendOTP(req: Request<{}, {}, SendOtpRequest>, res: Response): Promise<Response> {
    try {
      const { phone, email } = req.body;
      
      if (!phone) {
        return res.status(400).json({ 
          success: false, 
          message: 'Phone number is required' 
        });
      }
      
      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email is required to receive OTP' 
        });
      }

      // Pass both phone AND email to otpService
      const result = await otpService.sendOTP(phone, email);
      
      if (!result.success) {
        return res.status(429).json(result);
      }
      
      return res.json(result);
    } catch (error) {
      console.error('Send OTP error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  async verifyOTP(req: Request<{}, {}, VerifyOtpRequest>, res: Response): Promise<Response> {
    try {
      const { phone, otp } = req.body;
      
      if (!phone || !otp) {
        return res.status(400).json({ 
          success: false, 
          message: 'Phone and OTP are required' 
        });
      }

      const isValid = await otpService.verifyOTP(phone, otp);
      
      if (!isValid) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid or expired OTP' 
        });
      }

      // Find or create user
      let user = await prisma.user.findUnique({ where: { phone } });
      
      if (!user) {
        user = await prisma.user.create({
          data: { 
            phone, 
            language: 'ne',
            isActive: true 
          }
        });
        console.log(`✅ New user created: ${phone}`);
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      // Generate JWT token
      const token = jwtService.generateToken({ 
        userId: user.id, 
        phone: user.phone 
      });
      
      // Store session in Redis
      await redisService.storeSession(user.id, token);
      
      // Clear used OTP
      await otpService.clearOTP(phone);

      // Cast language to correct type
      const userLanguage = user.language as 'ne' | 'en';
      
      const response: AuthResponse = {
        success: true,
        message: 'Authentication successful',
        token,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name || undefined,
          nameNe: user.nameNe || undefined,
          language: userLanguage,
          province: user.province || undefined,
          district: user.district || undefined,
          municipality: user.municipality || undefined
        }
      };
      
      return res.json(response);
    } catch (error) {
      console.error('Verify OTP error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  async getMe(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).userId;
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          phone: true,
          name: true,
          nameNe: true,
          province: true,
          district: true,
          municipality: true,
          language: true,
          isActive: true,
          createdAt: true,
          lastLoginAt: true
        }
      });
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
      
      const userData = {
        ...user,
        language: user.language as 'ne' | 'en'
      };
      
      return res.json({ 
        success: true, 
        data: userData 
      });
    } catch (error) {
      console.error('Get me error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  async logout(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).userId;
      await redisService.deleteSession(userId);
      return res.json({ 
        success: true, 
        message: 'Logged out successfully' 
      });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
}

export default new AuthController();