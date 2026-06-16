import prisma from '../config/database.js';
import jwtService from './jwtService.js';
import redisService from './redisService.js';
import { User } from '../types/index.js';

class AuthService {
  async findOrCreateUser(phone: string): Promise<User> {
    let user = await prisma.user.findUnique({ where: { phone } });
    
    if (!user) {
      user = await prisma.user.create({
        data: { phone, language: 'ne', isActive: true }
      });
    }
    
    return user as User;
  }

  async updateLastLogin(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() }
    });
  }

  async createSession(userId: string): Promise<{ token: string; user: User }> {
    const user = await prisma.user.findUnique({ where: { id: userId } }) as User;
    const token = jwtService.generateToken({ userId, phone: user.phone });
    await redisService.storeSession(userId, token);
    return { token, user };
  }

  async validateSession(userId: string, token: string): Promise<boolean> {
    const storedToken = await redisService.getSession(userId);
    return storedToken === token;
  }

  async destroySession(userId: string): Promise<void> {
    await redisService.deleteSession(userId);
  }
}

export default new AuthService();