// src/controllers/cropController.ts
import { Response } from 'express';
import prisma from '../config/database.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

interface CreateCropInput {
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
  isActive?: boolean;
}

class CropController {
  /**
   * Get all active crops
   * GET /crops
   */
  async getAllCrops(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const crops = await prisma.crop.findMany({
        where: { isActive: true },
        orderBy: { name_en: 'asc' },
        select: {
          id: true,
          name_en: true,
          name_ne: true,
          description_en: true,
          description_ne: true,
          plantingSeason: true,
          harvestSeason: true,
          growingPeriod: true,
          temperatureMin: true,
          temperatureMax: true,
          rainfallMin: true,
          rainfallMax: true,
          soilType: true,
          imageUrl: true,
          createdAt: true
        }
      });

      return res.json({
        success: true,
        data: crops
      });
    } catch (error) {
      console.error('Get all crops error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get single crop by ID
   * GET /crops/:id
   */
  async getCropById(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const crop = await prisma.crop.findUnique({
        where: { id, isActive: true },
        select: {
          id: true,
          name_en: true,
          name_ne: true,
          description_en: true,
          description_ne: true,
          plantingSeason: true,
          harvestSeason: true,
          growingPeriod: true,
          temperatureMin: true,
          temperatureMax: true,
          rainfallMin: true,
          rainfallMax: true,
          soilType: true,
          imageUrl: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!crop) {
        return res.status(404).json({
          success: false,
          message: 'Crop not found'
        });
      }

      return res.json({
        success: true,
        data: crop
      });
    } catch (error) {
      console.error('Get crop by ID error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get crops by season
   * GET /crops/season/:season
   */
  async getCropsBySeason(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { season } = req.params;

      const crops = await prisma.crop.findMany({
        where: {
          OR: [
            { plantingSeason: { contains: season } },
            { harvestSeason: { contains: season } }
          ],
          isActive: true
        },
        orderBy: { name_en: 'asc' },
        select: {
          id: true,
          name_en: true,
          name_ne: true,
          description_en: true,
          description_ne: true,
          plantingSeason: true,
          harvestSeason: true,
          growingPeriod: true,
          temperatureMin: true,
          temperatureMax: true,
          rainfallMin: true,
          rainfallMax: true,
          soilType: true,
          imageUrl: true
        }
      });

      return res.json({
        success: true,
        data: crops
      });
    } catch (error) {
      console.error('Get crops by season error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Search crops by name
   * GET /crops/search?q=rice
   */
  async searchCrops(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Search query (q) is required'
        });
      }

      const crops = await prisma.crop.findMany({
        where: {
          OR: [
            { name_en: { contains: q } },
            { name_ne: { contains: q } },
            { description_en: { contains: q } },
            { description_ne: { contains: q } }
          ],
          isActive: true
        },
        orderBy: { name_en: 'asc' },
        select: {
          id: true,
          name_en: true,
          name_ne: true,
          description_en: true,
          description_ne: true,
          plantingSeason: true,
          harvestSeason: true,
          growingPeriod: true,
          temperatureMin: true,
          temperatureMax: true,
          rainfallMin: true,
          rainfallMax: true,
          soilType: true,
          imageUrl: true
        }
      });

      return res.json({
        success: true,
        data: crops
      });
    } catch (error) {
      console.error('Search crops error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Create crop with image upload
   * POST /crops
   */
  async createCrop(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const file = (req as any).file;

      const {
        name_en,
        name_ne,
        description_en,
        description_ne,
        plantingSeason,
        harvestSeason,
        growingPeriod,
        temperatureMin,
        temperatureMax,
        rainfallMin,
        rainfallMax,
        soilType
      } = req.body;

      // Validate required fields
      if (!name_en || !name_ne) {
        return res.status(400).json({
          success: false,
          message: 'name_en and name_ne are required'
        });
      }

      // Check if crop already exists
      const existing = await prisma.crop.findFirst({
        where: {
          OR: [
            { name_en: { equals: name_en } },
            { name_ne: { equals: name_ne } }
          ]
        }
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Crop with this name already exists'
        });
      }

      // Build image URL if file uploaded
      let imageUrl: string | null = null;
      if (file) {
        imageUrl = `/uploads/crops/${file.filename}`;
      }

      const cropData: CreateCropInput = {
        name_en,
        name_ne,
        isActive: true
      };

      // Add optional fields if they exist
      if (description_en) cropData.description_en = description_en;
      if (description_ne) cropData.description_ne = description_ne;
      if (plantingSeason) cropData.plantingSeason = plantingSeason;
      if (harvestSeason) cropData.harvestSeason = harvestSeason;
      if (growingPeriod) cropData.growingPeriod = parseInt(growingPeriod);
      if (temperatureMin) cropData.temperatureMin = parseFloat(temperatureMin);
      if (temperatureMax) cropData.temperatureMax = parseFloat(temperatureMax);
      if (rainfallMin) cropData.rainfallMin = parseInt(rainfallMin);
      if (rainfallMax) cropData.rainfallMax = parseInt(rainfallMax);
      if (soilType) cropData.soilType = soilType;
      if (imageUrl) cropData.imageUrl = imageUrl;

      const crop = await prisma.crop.create({
        data: cropData
      });

      return res.status(201).json({
        success: true,
        message: 'Crop created successfully',
        data: crop
      });
    } catch (error) {
      console.error('Create crop error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update crop with image upload
   * PUT /crops/:id
   */
  async updateCrop(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const file = (req as any).file;

      const {
        name_en,
        name_ne,
        description_en,
        description_ne,
        plantingSeason,
        harvestSeason,
        growingPeriod,
        temperatureMin,
        temperatureMax,
        rainfallMin,
        rainfallMax,
        soilType,
        isActive
      } = req.body;

      // Check if crop exists
      const existingCrop = await prisma.crop.findUnique({
        where: { id }
      });

      if (!existingCrop) {
        return res.status(404).json({
          success: false,
          message: 'Crop not found'
        });
      }

      // Build image URL if new file uploaded
      let imageUrl: string | null = existingCrop.imageUrl;
      if (file) {
        imageUrl = `/uploads/crops/${file.filename}`;
      }

      // Build update data
      const updateData: any = {};

      if (name_en) updateData.name_en = name_en;
      if (name_ne) updateData.name_ne = name_ne;
      if (description_en !== undefined) updateData.description_en = description_en;
      if (description_ne !== undefined) updateData.description_ne = description_ne;
      if (plantingSeason !== undefined) updateData.plantingSeason = plantingSeason;
      if (harvestSeason !== undefined) updateData.harvestSeason = harvestSeason;
      if (growingPeriod !== undefined) updateData.growingPeriod = growingPeriod ? parseInt(growingPeriod) : null;
      if (temperatureMin !== undefined) updateData.temperatureMin = temperatureMin ? parseFloat(temperatureMin) : null;
      if (temperatureMax !== undefined) updateData.temperatureMax = temperatureMax ? parseFloat(temperatureMax) : null;
      if (rainfallMin !== undefined) updateData.rainfallMin = rainfallMin ? parseInt(rainfallMin) : null;
      if (rainfallMax !== undefined) updateData.rainfallMax = rainfallMax ? parseInt(rainfallMax) : null;
      if (soilType !== undefined) updateData.soilType = soilType;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
      if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;

      const crop = await prisma.crop.update({
        where: { id },
        data: updateData
      });

      return res.json({
        success: true,
        message: 'Crop updated successfully',
        data: crop
      });
    } catch (error) {
      console.error('Update crop error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Admin: Delete crop (soft delete)
   * DELETE /crops/:id
   */
  async deleteCrop(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const crop = await prisma.crop.findUnique({
        where: { id }
      });

      if (!crop) {
        return res.status(404).json({
          success: false,
          message: 'Crop not found'
        });
      }

      await prisma.crop.update({
        where: { id },
        data: { isActive: false }
      });

      return res.json({
        success: true,
        message: 'Crop deleted successfully'
      });
    } catch (error) {
      console.error('Delete crop error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Admin: Get all crops including inactive
   * GET /crops/admin/all
   */
  async getAllCropsAdmin(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const crops = await prisma.crop.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          userPreferences: {
            select: {
              userId: true,
              isPrimary: true
            }
          }
        }
      });

      return res.json({
        success: true,
        data: crops
      });
    } catch (error) {
      console.error('Get all crops admin error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

export default new CropController();