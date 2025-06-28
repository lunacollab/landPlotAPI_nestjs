import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateZoneDto, UpdateZoneDto } from './dto/zone.dto';
import { ResourceNotFoundException, ConflictException } from '../../common/exceptions/custom.exception';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/pagination.interface';

@Injectable()
export class ZonesService {
  constructor(private prisma: PrismaService) {}

  async create(createZoneDto: CreateZoneDto) {
    // Check if zone with same name already exists
    const existingZone = await this.prisma.zone.findFirst({
      where: { name: createZoneDto.name },
    });

    if (existingZone) {
      throw new ConflictException(`Zone with name ${createZoneDto.name} already exists`);
    }

    return this.prisma.zone.create({
      data: createZoneDto,
      include: {
        _count: {
          select: {
            landPlots: true,
          },
        },
      },
    });
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    const [zones, total] = await Promise.all([
      this.prisma.zone.findMany({
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: {
              landPlots: true,
            },
          },
        },
      }),
      this.prisma.zone.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: zones,
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
    const zone = await this.prisma.zone.findUnique({
      where: { id },
      include: {
        landPlots: {
          include: {
            crops: {
              include: {
                crop: true,
              },
            },
            services: {
              include: {
                service: true,
              },
            },
          },
        },
        _count: {
          select: {
            landPlots: true,
          },
        },
      },
    });

    if (!zone) {
      throw new ResourceNotFoundException('Zone', id);
    }

    return zone;
  }

  async update(id: string, updateZoneDto: UpdateZoneDto) {
    // Check if zone exists
    const existingZone = await this.prisma.zone.findUnique({
      where: { id },
    });

    if (!existingZone) {
      throw new ResourceNotFoundException('Zone', id);
    }

    // If name is being updated, check for conflicts
    if (updateZoneDto.name && updateZoneDto.name !== existingZone.name) {
      const nameConflict = await this.prisma.zone.findFirst({
        where: {
          name: updateZoneDto.name,
          id: { not: id },
        },
      });

      if (nameConflict) {
        throw new ConflictException(`Zone with name ${updateZoneDto.name} already exists`);
      }
    }

    return this.prisma.zone.update({
      where: { id },
      data: updateZoneDto,
      include: {
        _count: {
          select: {
            landPlots: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    // Check if zone exists
    const existingZone = await this.prisma.zone.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            landPlots: true,
          },
        },
      },
    });

    if (!existingZone) {
      throw new ResourceNotFoundException('Zone', id);
    }

    // Check if zone has land plots
    if (existingZone._count.landPlots > 0) {
      throw new ConflictException('Cannot delete zone with existing land plots');
    }

    return this.prisma.zone.delete({
      where: { id },
    });
  }

  async getLandPlots(id: string) {
    const zone = await this.prisma.zone.findUnique({
      where: { id },
      include: {
        landPlots: {
          include: {
            crops: {
              include: {
                crop: true,
              },
            },
            services: {
              include: {
                service: true,
              },
            },
          },
        },
      },
    });

    if (!zone) {
      throw new ResourceNotFoundException('Zone', id);
    }

    return zone.landPlots;
  }
} 