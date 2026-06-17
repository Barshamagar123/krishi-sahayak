import prisma from '../config/database.js';
import { UpdateProfileRequest } from '../types/index.js';

export class ProfileService {
  /**
   * Get user profile with all details including preferences
   */
  async getFullProfile(userId: string) {
    return await prisma.user.findUnique({
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
        lastLoginAt: true,
        updatedAt: true,
        cropPreferences: {
          include: {
            crop: {
              select: {
                id: true,
                name_en: true,
                name_ne: true,
                description_en: true,
                description_ne: true
              }
            }
          }
        }
      }
    });
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: UpdateProfileRequest) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        nameNe: data.nameNe,
        province: data.province,
        district: data.district,
        municipality: data.municipality,
        language: data.language
      },
      select: {
        id: true,
        phone: true,
        name: true,
        nameNe: true,
        province: true,
        district: true,
        municipality: true,
        language: true,
        isActive: true
      }
    });
  }

  /**
   * Update user language
   */
  async updateLanguage(userId: string, language: 'ne' | 'en') {
    return await prisma.user.update({
      where: { id: userId },
      data: { language },
      select: {
        id: true,
        phone: true,
        language: true
      }
    });
  }

  /**
   * Deactivate user account
   */
  async deactivateUser(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
      select: {
        id: true,
        phone: true,
        isActive: true
      }
    });
  }

  /**
   * Reactivate user account
   */
  async reactivateUser(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
      select: {
        id: true,
        phone: true,
        isActive: true
      }
    });
  }

  /**
   * Add crop preference for user
   */
  async addCropPreference(userId: string, cropId: string, isPrimary: boolean = false) {
    if (isPrimary) {
      await prisma.userCropPreference.updateMany({
        where: { userId },
        data: { isPrimary: false }
      });
    }

    return await prisma.userCropPreference.create({
      data: {
        userId,
        cropId,
        isPrimary
      },
      include: {
        crop: {
          select: {
            id: true,
            name_en: true,
            name_ne: true
          }
        }
      }
    });
  }

  /**
   * Remove crop preference
   */
  async removeCropPreference(userId: string, cropId: string) {
    return await prisma.userCropPreference.deleteMany({
      where: { userId, cropId }
    });
  }

  /**
   * Get user's crop preferences
   */
  async getUserCropPreferences(userId: string) {
    return await prisma.userCropPreference.findMany({
      where: { userId },
      include: {
        crop: {
          select: {
            id: true,
            name_en: true,
            name_ne: true,
            description_en: true,
            description_ne: true
          }
        }
      }
    });
  }
}

export default new ProfileService();