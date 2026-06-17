import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import userService from '../services/userService.js';
import { UpdateProfileRequest } from '../types/index.js';

class UserController {
  /**
   * Get current user profile
   * GET /users/me
   */
  async getProfile(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const user = await userService.getUserById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      return res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update user profile
   * PUT /users/me
   */
  async updateProfile(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      const { name, nameNe, province, district, municipality, language }: UpdateProfileRequest = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const user = await userService.updateProfile(userId, {
        name,
        nameNe,
        province,
        district,
        municipality,
        language
      });

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });
    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update language preference
   * PUT /users/language
   */
  async updateLanguage(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      const { language } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      if (!language || !['ne', 'en'].includes(language)) {
        return res.status(400).json({
          success: false,
          message: 'Language must be "ne" or "en"'
        });
      }

      const user = await userService.updateLanguage(userId, language);

      return res.json({
        success: true,
        message: 'Language updated successfully',
        data: user
      });
    } catch (error) {
      console.error('Update language error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Deactivate user account
   * DELETE /users/me
   */
  async deactivateAccount(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const user = await userService.deactivateUser(userId);

      return res.json({
        success: true,
        message: 'Account deactivated successfully',
        data: user
      });
    } catch (error) {
      console.error('Deactivate account error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Reactivate user account
   * POST /users/reactivate
   */
  async reactivateAccount(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const user = await userService.reactivateUser(userId);

      return res.json({
        success: true,
        message: 'Account reactivated successfully',
        data: user
      });
    } catch (error) {
      console.error('Reactivate account error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get users by district
   * GET /users/by-district/:district
   */
  async getUsersByDistrict(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { district } = req.params;

      if (!district) {
        return res.status(400).json({
          success: false,
          message: 'District is required'
        });
      }

      const users = await userService.getUsersByDistrict(district);

      return res.json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error('Get users by district error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

export default new UserController();