import redisService from './redisService.js';
import emailService from './emailService.js';
import { generateOTP, validatePhoneNumber, formatPhoneNumber } from '../utils/helpers.js';

class OTPService {
  async sendOTP(phone: string, email: string): Promise<{ success: boolean; message: string; otpForDev?: string }> {
    const formattedPhone = formatPhoneNumber(phone);
    
    if (!validatePhoneNumber(formattedPhone)) {
      return { success: false, message: 'Invalid phone number' };
    }

    const isLimited = await redisService.isRateLimited(formattedPhone);
    if (isLimited) {
      return { success: false, message: 'Too many attempts. Try after 5 minutes.' };
    }

    const otp = generateOTP();
    await redisService.storeOTP(formattedPhone, otp);
    
    console.log(`\n📱 OTP for ${formattedPhone}: ${otp}\n`);
    
    // Send email
    if (email) {
      await emailService.sendOTPEmail(email, otp);
    }
    
    return { 
      success: true, 
      message: `OTP sent to ${email}`,
      otpForDev: process.env.NODE_ENV === 'development' ? otp : undefined
    };
  }

  async verifyOTP(phone: string, otp: string): Promise<boolean> {
    const formattedPhone = formatPhoneNumber(phone);
    const isValid = await redisService.verifyOTP(formattedPhone, otp);
    if (isValid) await redisService.deleteOTP(formattedPhone);
    return isValid;
  }

  async clearOTP(phone: string): Promise<void> {
    const formattedPhone = formatPhoneNumber(phone);
    await redisService.deleteOTP(formattedPhone);
  }
}

export default new OTPService();
