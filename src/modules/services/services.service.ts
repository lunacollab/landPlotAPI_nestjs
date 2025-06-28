import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto, ServiceFilterDto } from './dto/service.dto';
import { ResourceNotFoundException, ConflictException } from '../../common/exceptions/custom.exception';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/pagination.interface';
import { ServiceStatus } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto) {
    // Check if service with same code already exists
    const existingService = await this.prisma.service.findFirst({
      where: { code: createServiceDto.code },
    });

    if (existingService) {
      throw new ConflictException(`Service with code ${createServiceDto.code} already exists`);
    }

    return this.prisma.service.create({
      data: createServiceDto,
      include: {
        _count: {
          select: {
            landServices: true,
          },
        },
      },
    });
  }

  async findAll(paginationDto: PaginationDto, filters: ServiceFilterDto): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.name) where.name = { contains: filters.name, mode: 'insensitive' };
    if (filters.code) where.code = { contains: filters.code, mode: 'insensitive' };

    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: {
              landServices: true,
            },
          },
        },
      }),
      this.prisma.service.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: services,
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
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        landServices: {
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
        _count: {
          select: {
            landServices: true,
          },
        },
      },
    });

    if (!service) {
      throw new ResourceNotFoundException('Service', id);
    }

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    // Check if service exists
    const existingService = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      throw new ResourceNotFoundException('Service', id);
    }

    // If code is being updated, check for conflicts
    if (updateServiceDto.code && updateServiceDto.code !== existingService.code) {
      const codeConflict = await this.prisma.service.findFirst({
        where: {
          code: updateServiceDto.code,
          id: { not: id },
        },
      });

      if (codeConflict) {
        throw new ConflictException(`Service with code ${updateServiceDto.code} already exists`);
      }
    }

    return this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
      include: {
        _count: {
          select: {
            landServices: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    // Check if service exists
    const existingService = await this.prisma.service.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            landServices: true,
          },
        },
      },
    });

    if (!existingService) {
      throw new ResourceNotFoundException('Service', id);
    }

    // Check if service has active land services
    if (existingService._count.landServices > 0) {
      throw new ConflictException('Cannot delete service with active land services');
    }

    return this.prisma.service.delete({
      where: { id },
    });
  }

  async getActiveServices() {
    return this.prisma.service.findMany({
      where: { status: 'ACTIVE' },
      include: {
        _count: {
          select: {
            landServices: true,
          },
        },
      },
    });
  }

  async getServiceStatistics() {
    const [totalServices, servicesByStatus, activeServices] = await Promise.all([
      this.prisma.service.count(),
      this.prisma.service.groupBy({
        by: ['status'],
        _count: {
          id: true,
        },
      }),
      this.prisma.service.count({
        where: { status: 'ACTIVE' },
      }),
    ]);

    return {
      totalServices,
      activeServices,
      inactiveServices: totalServices - activeServices,
      servicesByStatus: servicesByStatus.map(item => ({
        status: item.status,
        count: item._count.id,
      })),
    };
  }

  async calculateServiceCost(serviceId: string, area: number) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new ResourceNotFoundException('Service', serviceId);
    }

    return {
      serviceId,
      serviceName: service.name,
      area,
      costPerSqm: service.costPerSqm,
      totalCost: service.costPerSqm * area,
      duration: service.duration,
    };
  }
} 