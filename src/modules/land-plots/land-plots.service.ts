import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLandPlotDto, UpdateLandPlotDto, LandPlotFilterDto } from './dto/land-plot.dto';
import { ResourceNotFoundException, ConflictException } from '../../common/exceptions/custom.exception';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/pagination.interface';
import { LandStatus } from '@prisma/client';

@Injectable()
export class LandPlotsService {
  constructor(private prisma: PrismaService) {}

  async create(createLandPlotDto: CreateLandPlotDto) {
    // Check if zone exists
    const zone = await this.prisma.zone.findUnique({
      where: { id: createLandPlotDto.zoneId },
    });

    if (!zone) {
      throw new ResourceNotFoundException('Zone', createLandPlotDto.zoneId);
    }

    // Check if land plot with same name in zone already exists
    const existingPlot = await this.prisma.landPlot.findFirst({
      where: {
        name: createLandPlotDto.name,
        zoneId: createLandPlotDto.zoneId,
      },
    });

    if (existingPlot) {
      throw new ConflictException(`Land plot with name ${createLandPlotDto.name} already exists in this zone`);
    }

    return this.prisma.landPlot.create({
      data: createLandPlotDto,
      include: {
        zone: true,
        crops: {
          include: {
            crop: true,
          },
        },
        services: {
          include: {
            service: true,
            worker: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        assignments: {
          include: {
            worker: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            crops: true,
            services: true,
            assignments: true,
          },
        },
      },
    });
  }

  async findAll(paginationDto: PaginationDto, filters: LandPlotFilterDto): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (filters.zoneId) where.zoneId = filters.zoneId;
    if (filters.status) where.status = filters.status;
    if (filters.soilType) where.soilType = { contains: filters.soilType, mode: 'insensitive' };

    const [landPlots, total] = await Promise.all([
      this.prisma.landPlot.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          zone: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
          crops: {
            include: {
              crop: true,
            },
            where: {
              status: { not: 'HARVESTED' },
            },
          },
          services: {
            include: {
              service: true,
              worker: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            where: {
              status: { in: ['PENDING', 'IN_PROGRESS'] },
            },
          },
          _count: {
            select: {
              crops: true,
              services: true,
              assignments: true,
            },
          },
        },
      }),
      this.prisma.landPlot.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: landPlots,
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
    const landPlot = await this.prisma.landPlot.findUnique({
      where: { id },
      include: {
        zone: {
          select: {
            id: true,
            name: true,
            color: true,
            address: true,
          },
        },
        crops: {
          include: {
            crop: true,
          },
          orderBy: { plantingDate: 'desc' },
        },
        services: {
          include: {
            service: true,
            worker: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { scheduledAt: 'desc' },
        },
        assignments: {
          include: {
            worker: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { workDate: 'desc' },
        },
        schedules: {
          orderBy: { season: 'desc' },
        },
        _count: {
          select: {
            crops: true,
            services: true,
            assignments: true,
            schedules: true,
          },
        },
      },
    });

    if (!landPlot) {
      throw new ResourceNotFoundException('Land Plot', id);
    }

    return landPlot;
  }

  async update(id: string, updateLandPlotDto: UpdateLandPlotDto) {
    // Check if land plot exists
    const existingPlot = await this.prisma.landPlot.findUnique({
      where: { id },
      include: { zone: true },
    });

    if (!existingPlot) {
      throw new ResourceNotFoundException('Land Plot', id);
    }

    // If name is being updated, check for conflicts in the same zone
    if (updateLandPlotDto.name && updateLandPlotDto.name !== existingPlot.name) {
      const nameConflict = await this.prisma.landPlot.findFirst({
        where: {
          name: updateLandPlotDto.name,
          zoneId: existingPlot.zoneId,
          id: { not: id },
        },
      });

      if (nameConflict) {
        throw new ConflictException(`Land plot with name ${updateLandPlotDto.name} already exists in this zone`);
      }
    }

    return this.prisma.landPlot.update({
      where: { id },
      data: updateLandPlotDto,
      include: {
        zone: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        _count: {
          select: {
            crops: true,
            services: true,
            assignments: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    // Check if land plot exists
    const existingPlot = await this.prisma.landPlot.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            crops: true,
            services: true,
            assignments: true,
          },
        },
      },
    });

    if (!existingPlot) {
      throw new ResourceNotFoundException('Land Plot', id);
    }

    // Check if land plot has active crops, services, or assignments
    if (existingPlot._count.crops > 0 || existingPlot._count.services > 0 || existingPlot._count.assignments > 0) {
      throw new ConflictException('Cannot delete land plot with active crops, services, or assignments');
    }

    return this.prisma.landPlot.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: LandStatus) {
    const landPlot = await this.prisma.landPlot.findUnique({
      where: { id },
    });

    if (!landPlot) {
      throw new ResourceNotFoundException('Land Plot', id);
    }

    return this.prisma.landPlot.update({
      where: { id },
      data: { status },
      include: {
        zone: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });
  }

  async getHistory(id: string) {
    const landPlot = await this.prisma.landPlot.findUnique({
      where: { id },
      include: {
        crops: {
          include: {
            crop: true,
          },
          orderBy: { plantingDate: 'desc' },
        },
        services: {
          include: {
            service: true,
            worker: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { scheduledAt: 'desc' },
        },
        assignments: {
          include: {
            worker: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { workDate: 'desc' },
        },
      },
    });

    if (!landPlot) {
      throw new ResourceNotFoundException('Land Plot', id);
    }

    return {
      landPlot: {
        id: landPlot.id,
        name: landPlot.name,
        lastSeasonCrop: landPlot.lastSeasonCrop,
      },
      history: {
        crops: landPlot.crops,
        services: landPlot.services,
        assignments: landPlot.assignments,
      },
    };
  }

  async getSchedule(id: string) {
    const landPlot = await this.prisma.landPlot.findUnique({
      where: { id },
      include: {
        schedules: {
          orderBy: { season: 'desc' },
        },
        crops: {
          include: {
            crop: true,
          },
          where: {
            status: { in: ['PLANNED', 'PLANTED', 'GROWING'] },
          },
          orderBy: { plantingDate: 'desc' },
        },
      },
    });

    if (!landPlot) {
      throw new ResourceNotFoundException('Land Plot', id);
    }

    return {
      landPlot: {
        id: landPlot.id,
        name: landPlot.name,
        status: landPlot.status,
      },
      schedules: landPlot.schedules,
      currentCrops: landPlot.crops,
    };
  }

  async uploadImage(id: string, imageUrl: string) {
    const landPlot = await this.prisma.landPlot.findUnique({
      where: { id },
    });

    if (!landPlot) {
      throw new ResourceNotFoundException('Land Plot', id);
    }

    return this.prisma.landPlot.update({
      where: { id },
      data: { imageUrl },
      include: {
        zone: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });
  }
} 