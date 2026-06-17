export type Language = 'ne' | 'en';
export type UserRole = 'user' | 'admin';  // ✅ ADD THIS

export interface User {
  id: string;
  phone: string;
  name?: string;
  nameNe?: string;
  province?: string;
  district?: string;
  municipality?: string;
  language: Language;
  role: UserRole;  // ✅ ADD THIS
  isActive: boolean;  // ✅ ADD THIS
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SendOtpRequest {
  phone: string;
  email: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    phone: string;
    name?: string;
    nameNe?: string;
    province?: string;
    district?: string;
    municipality?: string;
    language: Language;
    role?: UserRole;  // ✅ ADD THIS
    isActive?: boolean;
  };
}

export interface JWTPayload {
  userId: string;
  phone: string;
  role?: UserRole;  // ✅ ADD THIS
  iat?: number;
  exp?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}