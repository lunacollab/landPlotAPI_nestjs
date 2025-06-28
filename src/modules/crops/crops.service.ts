import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCropDto, UpdateCropDto, CropFilterDto } from './dto/crop.dto';
import { ResourceNotFoundException, ConflictException } from '../../common/exceptions/custom.exception';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/pagination.interface';
import { CropCategory } from '@prisma/client';

@Injectable()
export class CropsService {
  constructor(private prisma: PrismaService) {}

  async create(createCropDto: CreateCropDto) {
    // Check if crop with same name already exists
    const existingCrop = await this.prisma.crop.findFirst({
      where: { name: createCropDto.name },
    });

    if (existingCrop) {
      throw new ConflictException(`Crop with name ${createCropDto.name} already exists`);
    }

    return this.prisma.crop.create({
      data: createCropDto,
      include: {
        _count: {
          select: {
            plantings: true,
          },
        },
      },
    });
  }

  async findAll(paginationDto: PaginationDto, filters: CropFilterDto): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (filters.category) where.category = filters.category;
    if (filters.status) where.status = filters.status;
    if (filters.name) where.name = { contains: filters.name, mode: 'insensitive' };

    const [crops, total] = await Promise.all([
      this.prisma.crop.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: {
              plantings: true,
            },
          },
        },
      }),
      this.prisma.crop.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: crops,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const crop = await this.prisma.crop.findUnique({
      where: { id },
      include: {
        plantings: {
          include: {
            landPlot: {
              include: {
                zone: {
                  select: {
                    id: true,
                    name: true,
                    color: true,
                  },
                },
              },
            },
          },
          orderBy: { plantingDate: 'desc' },
        },
        _count: {
          select: {
            plantings: true,
          },
        },
      },
    });

    if (!crop) {
      throw new ResourceNotFoundException('Crop', id);
    }

    return crop;
  }

  async update(id: string, updateCropDto: UpdateCropDto) {
    // Check if crop exists
    const existingCrop = await this.prisma.crop.findUnique({
      where: { id },
    });

    if (!existingCrop) {
      throw new ResourceNotFoundException('Crop', id);
    }

    // If name is being updated, check for conflicts
    if (updateCropDto.name && updateCropDto.name !== existingCrop.name) {
      const nameConflict = await this.prisma.crop.findFirst({
        where: {
          name: updateCropDto.name,
          id: { not: id },
        },
      });

      if (nameConflict) {
        throw new ConflictException(`Crop with name ${updateCropDto.name} already exists`);
      }
    }

    return this.prisma.crop.update({
      where: { id },
      data: updateCropDto,
      include: {
        _count: {
          select: {
            plantings: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    // Check if crop exists
    const existingCrop = await this.prisma.crop.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            plantings: true,
          },
        },
      },
    });

    if (!existingCrop) {
      throw new ResourceNotFoundException('Crop', id);
    }

    // Check if crop has active plantings
    if (existingCrop._count.plantings > 0) {
      throw new ConflictException('Cannot delete crop with active plantings');
    }

    return this.prisma.crop.delete({
      where: { id },
    });
  }

  async getCategories() {
    return Object.values(CropCategory).map(category => ({
      value: category,
      label: category.replace('_', ' ').toLowerCase(),
    }));
  }

  async getCropsByCategory(category: CropCategory) {
    return this.prisma.crop.findMany({
      where: { category },
      include: {
        _count: {
          select: {
            plantings: true,
          },
        },
      },
    });
  }

  async getActiveCrops() {
    return this.prisma.crop.findMany({
      where: { status: 'ACTIVE' },
      include: {
        _count: {
          select: {
            plantings: true,
          },
        },
      },
    });
  }

  async getCropStatistics() {
    const [totalCrops, cropsByCategory, activeCrops] = await Promise.all([
      this.prisma.crop.count(),
      this.prisma.crop.groupBy({
        by: ['category'],
        _count: {
          id: true,
        },
      }),
      this.prisma.crop.count({
        where: { status: 'ACTIVE' },
      }),
    ]);

    return {
      totalCrops,
      activeCrops,
      inactiveCrops: totalCrops - activeCrops,
      cropsByCategory: cropsByCategory.map(item => ({
        category: item.category,
        count: item._count.id,
      })),
    };
  }
} 