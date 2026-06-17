import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import profileService from '../services/profileService.js';
import { UpdateProfileRequest } from '../types/index.js';

class ProfileController {
  /**
   * Get user profile with full details
   * GET /profile/me
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

      const user = await profileService.getFullProfile(userId);

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
   * PUT /profile/me
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

      const user = await profileService.updateProfile(userId, {
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
   * PUT /profile/language
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

      const user = await profileService.updateLanguage(userId, language);

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
   * DELETE /profile/me
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

      const user = await profileService.deactivateUser(userId);

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
   * POST /profile/reactivate
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

      const user = await profileService.reactivateUser(userId);

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
   * Add crop preference
   * POST /profile/preferences
   */
  async addCropPreference(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      const { cropId, isPrimary } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      if (!cropId) {
        return res.status(400).json({
          success: false,
          message: 'cropId is required'
        });
      }

      const preference = await profileService.addCropPreference(userId, cropId, isPrimary || false);

      return res.json({
        success: true,
        message: 'Crop preference added successfully',
        data: preference
      });
    } catch (error) {
      console.error('Add crop preference error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Remove crop preference
   * DELETE /profile/preferences/:cropId
   */
  async removeCropPreference(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      const { cropId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      await profileService.removeCropPreference(userId, cropId);

      return res.json({
        success: true,
        message: 'Crop preference removed successfully'
      });
    } catch (error) {
      console.error('Remove crop preference error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get user's crop preferences
   * GET /profile/preferences
   */
  async getCropPreferences(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const preferences = await profileService.getUserCropPreferences(userId);

      return res.json({
        success: true,
        data: preferences
      });
    } catch (error) {
      console.error('Get crop preferences error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

export default new ProfileController();