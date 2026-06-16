import nodemailer from 'nodemailer';

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendOTPEmail(to: string, otp: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"Krishi Sahayak" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: '🔐 Your Krishi Sahayak OTP Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #4CAF50;">🌾 Krishi Sahayak</h2>
            <p>Your verification code is:</p>
            <h1 style="background: #f0f0f0; padding: 15px; text-align: center; letter-spacing: 5px;">${otp}</h1>
            <p>This code expires in 5 minutes.</p>
            <hr>
            <p style="color: #999; font-size: 12px;">Nepal's Farming Assistant</p>
          </div>
        `,
        text: `Your Krishi Sahayak OTP is: ${otp}\nValid for 5 minutes.`,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`📧 OTP email sent to ${to}`);
      return true;
    } catch (error) {
      console.error('Email send error:', error);
      return false;
    }
  }
}

export default new EmailService();
