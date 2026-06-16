import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/index.js';
import { JWTPayload } from '../types/index.js';

class JWTService {
  generateToken(payload: JWTPayload): string {
    const options: SignOptions = {
      expiresIn: config.jwt.expiresIn as SignOptions['expiresIn']
    };
    return jwt.sign(payload, config.jwt.secret, options);
  }

  verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, config.jwt.secret) as JWTPayload;
    } catch {
      return null;
    }
  }
}

export default new JWTService();