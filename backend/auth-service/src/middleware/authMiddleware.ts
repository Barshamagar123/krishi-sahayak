import { Request, Response, NextFunction } from 'express';
import jwtService from '../services/jwtService.js';
import redisService from '../services/redisService.js';

export interface AuthRequest extends Request {
  userId?: string;
  userPhone?: string;
}

export async function authMiddleware(
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): Promise<void | Response> {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwtService.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const session = await redisService.getSession(decoded.userId);
    if (!session || session !== token) {
      return res.status(401).json({ success: false, message: 'Session expired' });
    }

    req.userId = decoded.userId;
    req.userPhone = decoded.phone;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ success: false, message: 'Authentication error' });
  }
}