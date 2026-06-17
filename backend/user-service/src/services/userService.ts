import prisma from '../config/database.js';
import { UpdateProfileRequest } from '../types/index.js';

export class UserService {
  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
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
   * Get user by phone
   */
  async getUserByPhone(phone: string) {
    return await prisma.user.findUnique({
      where: { phone },
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
   * Check if user exists
   */
  async userExists(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });
    return !!user;
  }

  /**
   * Get all active users (admin only)
   */
  async getAllActiveUsers() {
    return await prisma.user.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        phone: true,
        name: true,
        nameNe: true,
        province: true,
        district: true,
        createdAt: true
      }
    });
  }

  /**
   * Get users by district (for location-based features)
   */
  async getUsersByDistrict(district: string) {
    return await prisma.user.findMany({
      where: {
        district: district,
        isActive: true
      },
      select: {
        id: true,
        phone: true,
        name: true,
        nameNe: true,
        province: true,
        district: true,
        municipality: true
      }
    });
  }
}

export default new UserService();