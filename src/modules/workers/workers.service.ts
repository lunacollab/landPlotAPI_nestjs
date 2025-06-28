import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWorkerDto, UpdateWorkerDto, WorkerFilterDto } from './dto/worker.dto';
import { ResourceNotFoundException, ConflictException } from '../../common/exceptions/custom.exception';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/pagination.interface';
import { Role, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class WorkersService {
  constructor(private prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto, filters: WorkerFilterDto): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { deletedAt: null };
    if (filters.role) where.role = filters.role;
    if (filters.status) where.status = filters.status;
    if (filters.name) where.name = { contains: filters.name, mode: 'insensitive' };
    if (filters.email) where.email = { contains: filters.email, mode: 'insensitive' };

    const [workers, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: {
              assignments: true,
              schedules: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: workers,
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
    const worker = await this.prisma.user.findUnique({
      where: { id },
      include: {
        assignments: {
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
          orderBy: { workDate: 'desc' },
        },
        schedules: {
          orderBy: { workDate: 'desc' },
        },
        _count: {
          select: {
            assignments: true,
            schedules: true,
          },
        },
      },
    });

    if (!worker || worker.deletedAt) {
      throw new ResourceNotFoundException('Worker', id);
    }

    return worker;
  }

  async update(id: string, updateWorkerDto: UpdateWorkerDto) {
    // Check if worker exists
    const existingWorker = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingWorker) {
      throw new ResourceNotFoundException('Worker', id);
    }

    // If email is being updated, check for conflicts
    if (updateWorkerDto.email && updateWorkerDto.email !== existingWorker.email) {
      const emailConflict = await this.prisma.user.findFirst({
        where: {
          email: updateWorkerDto.email,
          id: { not: id },
        },
      });

      if (emailConflict) {
        throw new ConflictException(`Worker with email ${updateWorkerDto.email} already exists`);
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: updateWorkerDto,
      include: {
        _count: {
          select: {
            assignments: true,
            schedules: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    // Check if worker exists
    const existingWorker = await this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            assignments: true,
            schedules: true,
          },
        },
      },
    });

    if (!existingWorker || existingWorker.deletedAt) {
      throw new ResourceNotFoundException('Worker', id);
    }

    // Check if worker has active assignments or schedules
    if (existingWorker._count.assignments > 0 || existingWorker._count.schedules > 0) {
      throw new ConflictException('Cannot delete worker with active assignments or schedules');
    }

    // Soft delete: set deletedAt
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getWorkerAssignments(id: string) {
    const worker = await this.prisma.user.findUnique({
      where: { id },
      include: {
        assignments: {
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
          orderBy: { workDate: 'desc' },
        },
      },
    });

    if (!worker) {
      throw new ResourceNotFoundException('Worker', id);
    }

    return {
      worker: {
        id: worker.id,
        name: worker.name,
        email: worker.email,
        status: worker.status,
      },
      assignments: worker.assignments,
    };
  }

  async getWorkerSchedule(id: string, startDate?: Date, endDate?: Date) {
    const worker = await this.prisma.user.findUnique({
      where: { id },
      include: {
        assignments: {
          where: {
            workDate: {
              gte: startDate,
              lte: endDate,
            },
          },
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
          orderBy: { workDate: 'asc' },
        },
        schedules: {
          where: {
            workDate: {
              gte: startDate,
              lte: endDate,
            },
          },
          orderBy: { workDate: 'asc' },
        },
      },
    });

    if (!worker) {
      throw new ResourceNotFoundException('Worker', id);
    }

    return {
      worker: {
        id: worker.id,
        name: worker.name,
        email: worker.email,
      },
      assignments: worker.assignments,
      schedules: worker.schedules,
    };
  }

  async getWorkingWorkers() {
    return this.prisma.user.findMany({
      where: { 
        role: Role.WORKER,
        status: UserStatus.WORKING,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            assignments: true,
            schedules: true,
          },
        },
      },
    });
  }

  async getWorkerStatistics() {
    const [totalWorkers, workersByStatus, workingWorkers] = await Promise.all([
      this.prisma.user.count({
        where: { role: Role.WORKER, deletedAt: null },
      }),
      this.prisma.user.groupBy({
        by: ['status'],
        where: { role: Role.WORKER, deletedAt: null },
        _count: {
          id: true,
        },
      }),
      this.prisma.user.count({
        where: { 
          role: Role.WORKER,
          status: UserStatus.WORKING,
          deletedAt: null,
        },
      }),
    ]);

    return {
      totalWorkers,
      workingWorkers,
      restingWorkers: totalWorkers - workingWorkers,
      workersByStatus: workersByStatus.map(item => ({
        status: item.status,
        count: item._count.id,
      })),
    };
  }
} 