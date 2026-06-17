export interface User {
  id: string;
  phone: string;
  name?: string;
  nameNe?: string;
  province?: string;
  district?: string;
  municipality?: string;
  language: 'ne' | 'en';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileRequest {
  name?: string;
  nameNe?: string;
  province?: string;
  district?: string;
  municipality?: string;
  language?: 'ne' | 'en';  // ✅ ADD THIS
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}