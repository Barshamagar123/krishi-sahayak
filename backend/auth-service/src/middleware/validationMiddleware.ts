import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const sendOtpSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^(98|97|96)[0-9]{8}$/)  // ← FIXED!
    .required()
    .messages({
      'string.pattern.base': 'Phone number must start with 98, 97, or 96 and have 10 digits',
      'any.required': 'Phone number is required'
    }),
  email: Joi.string()  // ← ADD email validation
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    })
});

const verifyOtpSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^(98|97|96)[0-9]{8}$/)  // ← FIXED!
    .required(),
  otp: Joi.string()
    .length(6)
    .pattern(/^\d+$/)
    .required()
});

export function validateSendOTP(req: Request, res: Response, next: NextFunction): void | Response {
  const { error } = sendOtpSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
}

export function validateVerifyOTP(req: Request, res: Response, next: NextFunction): void | Response {
  const { error } = verifyOtpSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
}