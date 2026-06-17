// src/types/index.ts
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
  language?: 'ne' | 'en';
}

// ✅ ADD THESE CROP TYPES
export interface Crop {
  id: string;
  name_en: string;
  name_ne: string;
  description_en?: string;
  description_ne?: string;
  plantingSeason?: string;
  harvestSeason?: string;
  growingPeriod?: number;
  temperatureMin?: number;
  temperatureMax?: number;
  rainfallMin?: number;
  rainfallMax?: number;
  soilType?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCropRequest {
  name_en: string;
  name_ne: string;
  description_en?: string;
  description_ne?: string;
  plantingSeason?: string;
  harvestSeason?: string;
  growingPeriod?: number;
  temperatureMin?: number;
  temperatureMax?: number;
  rainfallMin?: number;
  rainfallMax?: number;
  soilType?: string;
  imageUrl?: string;
}

export interface UpdateCropRequest extends Partial<CreateCropRequest> {
  isActive?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface AuthRequest extends Request {
  userId?: string;
  userPhone?: string;
}