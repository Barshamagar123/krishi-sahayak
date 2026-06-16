export type Language = 'ne' | 'en';
export interface User {
  id: string;
  phone: string;
  name?: string;
  nameNe?: string;
  province?: string;
  district?: string;
  municipality?: string;
 language: Language;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SendOtpRequest {
  phone: string;
  email:string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: Partial<User>;
}

export interface JWTPayload {
  userId: string;
  phone: string;
  iat?: number;
  exp?: number;
}