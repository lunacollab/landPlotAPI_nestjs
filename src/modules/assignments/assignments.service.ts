import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAssignmentDto, UpdateAssignmentDto, AssignmentFilterDto } from './dto/assignment.dto';
import { ResourceNotFoundException, ConflictException } from '../../common/exceptions/custom.exception';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/pagination.interface';
import { WorkStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAssignmentDto: CreateAssignmentDto) {
    // Check if worker exists
    const worker = await this.prisma.user.findUnique({
      where: { id: createAssignmentDto.workerId },
    });

    if (!worker) {
      throw new ResourceNotFoundException('Worker', createAssignmentDto.workerId);
    }

    // Check if land plot exists
    const landPlot = await this.prisma.landPlot.findUnique({
      where: { id: createAssignmentDto.landPlotId },
    });

    if (!landPlot) {
      throw new ResourceNotFoundException('Land Plot', createAssignmentDto.landPlotId);
    }

    // Check for time conflicts on the same land plot
    const conflictingAssignment = await this.prisma.workerAssignment.findFirst({
      where: {
        landPlotId: createAssignmentDto.landPlotId,
        workDate: createAssignmentDto.workDate,
        OR: [
          {
            startTime: {
              lt: createAssignmentDto.endTime,
              gte: createAssignmentDto.startTime,
            },
          },
          {
            endTime: {
              gt: createAssignmentDto.startTime,
              lte: createAssignmentDto.endTime,
            },
          },
        ],
      },
    });

    if (conflictingAssignment) {
      throw new ConflictException('Time conflict with existing assignment on this land plot');
    }

    return this.prisma.workerAssignment.create({
      data: createAssignmentDto,
      include: {
        worker: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
          },
        },
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
    });
  }

  async findAll(paginationDto: PaginationDto, filters: AssignmentFilterDto): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.paymentStatus) where.paymentStatus = filters.paymentStatus;
    if (filters.workerId) where.workerId = filters.workerId;
    if (filters.landPlotId) where.landPlotId = filters.landPlotId;
    if (filters.workDate) where.workDate = filters.workDate;
    if (filters.cropType) where.cropType = { contains: filters.cropType, mode: 'insensitive' };

    const [assignments, total] = await Promise.all([
      this.prisma.workerAssignment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          worker: {
            select: {
              id: true,
              name: true,
              email: true,
              status: true,
            },
          },
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
      }),
      this.prisma.workerAssignment.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: assignments,
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
    const assignment = await this.prisma.workerAssignment.findUnique({
      where: { id },
      include: {
        worker: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            status: true,
            expertise: true,
          },
        },
        landPlot: {
          include: {
            zone: {
              select: {
                id: true,
                name: true,
                color: true,
                address: true,
              },
            },
          },
        },
      },
    });

    if (!assignment) {
      throw new ResourceNotFoundException('Assignment', id);
    }

    return assignment;
  }

  async update(id: string, updateAssignmentDto: UpdateAssignmentDto) {
    // Check if assignment exists
    const existingAssignment = await this.prisma.workerAssignment.findUnique({
      where: { id },
    });

    if (!existingAssignment) {
      throw new ResourceNotFoundException('Assignment', id);
    }

    // If time is being updated, check for conflicts
    if (updateAssignmentDto.startTime || updateAssignmentDto.endTime || updateAssignmentDto.workDate) {
      const startTime = updateAssignmentDto.startTime || existingAssignment.startTime;
      const endTime = updateAssignmentDto.endTime || existingAssignment.endTime;
      const workDate = updateAssignmentDto.workDate || existingAssignment.workDate;

      const conflictingAssignment = await this.prisma.workerAssignment.findFirst({
        where: {
          landPlotId: existingAssignment.landPlotId,
          workDate: workDate,
          id: { not: id },
          OR: [
            {
              startTime: {
                lt: endTime,
                gte: startTime,
              },
            },
            {
              endTime: {
                gt: startTime,
                lte: endTime,
              },
            },
          ],
        },
      });

      if (conflictingAssignment) {
        throw new ConflictException('Time conflict with existing assignment on this land plot');
      }
    }

    return this.prisma.workerAssignment.update({
      where: { id },
      data: updateAssignmentDto,
      include: {
        worker: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
          },
        },
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
    });
  }

  async remove(id: string) {
    // Check if assignment exists
    const existingAssignment = await this.prisma.workerAssignment.findUnique({
      where: { id },
    });

    if (!existingAssignment) {
      throw new ResourceNotFoundException('Assignment', id);
    }

    // Check if assignment is already completed
    if (existingAssignment.status === 'COMPLETED') {
      throw new ConflictException('Cannot delete completed assignment');
    }

    return this.prisma.workerAssignment.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: WorkStatus) {
    const assignment = await this.prisma.workerAssignment.findUnique({
      where: { id },
    });

    if (!assignment) {
      throw new ResourceNotFoundException('Assignment', id);
    }

    return this.prisma.workerAssignment.update({
      where: { id },
      data: { status },
      include: {
        worker: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
          },
        },
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
    });
  }

  async startAssignment(id: string) {
    return this.updateStatus(id, 'IN_PROGRESS');
  }

  async completeAssignment(id: string) {
    return this.updateStatus(id, 'COMPLETED');
  }

  async getWorkerAssignments(workerId: string) {
    const worker = await this.prisma.user.findUnique({
      where: { id: workerId },
    });

    if (!worker) {
      throw new ResourceNotFoundException('Worker', workerId);
    }

    return this.prisma.workerAssignment.findMany({
      where: { workerId },
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
    });
  }

  async getAssignmentsByDate(date: Date) {
    return this.prisma.workerAssignment.findMany({
      where: { workDate: date },
      include: {
        worker: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
          },
        },
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
      orderBy: { startTime: 'asc' },
    });
  }

  async getAssignmentStatistics() {
    const [totalAssignments, assignmentsByStatus, assignmentsByPaymentStatus] = await Promise.all([
      this.prisma.workerAssignment.count(),
      this.prisma.workerAssignment.groupBy({
        by: ['status'],
        _count: {
          id: true,
        },
      }),
      this.prisma.workerAssignment.groupBy({
        by: ['paymentStatus'],
        _count: {
          id: true,
        },
      }),
    ]);

    return {
      totalAssignments,
      assignmentsByStatus: assignmentsByStatus.map(item => ({
        status: item.status,
        count: item._count.id,
      })),
      assignmentsByPaymentStatus: assignmentsByPaymentStatus.map(item => ({
        paymentStatus: item.paymentStatus,
        count: item._count.id,
      })),
    };
  }
} 