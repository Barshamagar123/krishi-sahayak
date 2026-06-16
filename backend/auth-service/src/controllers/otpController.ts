import { Request, Response } from 'express';
import otpService from '../services/otpService.js';

export class OTPController {
  async sendOTP(req: Request, res: Response): Promise<Response> {
    const { phone, email } = req.body;  // ✅ Added email
    
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number required' });
    }
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address required' });
    }

    // ✅ Pass both phone AND email
    const result = await otpService.sendOTP(phone, email);
    
    if (!result.success) {
      return res.status(429).json(result);
    }
    
    return res.json(result);
  }

  async resendOTP(req: Request, res: Response): Promise<Response> {
    const { phone, email } = req.body;  // ✅ Added email
    
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number required' });
    }
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address required' });
    }

    // ✅ Pass both phone AND email
    const result = await otpService.sendOTP(phone, email);
    return res.json(result);
  }
}

export default new OTPController();