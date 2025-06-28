import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsService } from './assignments.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAssignmentDto, UpdateAssignmentDto } from './dto/assignment.dto';
import { WorkStatus, PaymentStatus } from '@prisma/client';
import { Role, UserStatus } from '@prisma/client';
import { LandStatus } from '@prisma/client';

describe('AssignmentsService', () => {
  let service: AssignmentsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignmentsService,
        {
          provide: PrismaService,
          useValue: {
            workerAssignment: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
              groupBy: jest.fn(),
              findFirst: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
            },
            landPlot: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AssignmentsService>(AssignmentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new assignment', async () => {
      const createAssignmentDto: CreateAssignmentDto = {
        workDate: new Date('2024-01-15T08:00:00Z'),
        startTime: new Date('2024-01-15T08:00:00Z'),
        endTime: new Date('2024-01-15T12:00:00Z'),
        hourlyRate: 15.0,
        task: 'Soil preparation for tomato planting',
        landArea: 100.0,
        cropType: 'Tomato',
        status: WorkStatus.ASSIGNED,
        paymentStatus: PaymentStatus.PENDING,
        workerId: 'worker-1',
        landPlotId: 'plot-1',
      };

      const mockWorker = {
        id: 'worker-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        password: 'hashedpassword',
        role: Role.WORKER,
        status: UserStatus.WORKING,
        expertise: { skills: ['plowing', 'planting'] },
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockLandPlot = {
        id: 'plot-1',
        name: 'Plot A',
        soilType: 'Loamy',
        area: 100.0,
        status: LandStatus.EMPTY,
        coordinates: { lat: 10.762622, lng: 106.660172 },
        zoneId: 'zone-1',
        notes: null,
        lastSeasonCrop: null,
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockAssignment = {
        id: 'assignment-1',
        workDate: new Date('2024-01-15T08:00:00Z'),
        startTime: new Date('2024-01-15T08:00:00Z'),
        endTime: new Date('2024-01-15T12:00:00Z'),
        hourlyRate: 15.0,
        task: 'Soil preparation for tomato planting',
        landArea: 100.0,
        cropType: 'Tomato',
        status: WorkStatus.ASSIGNED,
        paymentStatus: PaymentStatus.PENDING,
        workerId: 'worker-1',
        landPlotId: 'plot-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockWorker);
      jest.spyOn(prisma.landPlot, 'findUnique').mockResolvedValue(mockLandPlot);
      jest.spyOn(prisma.workerAssignment, 'create').mockResolvedValue(mockAssignment);

      const result = await service.create(createAssignmentDto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'worker-1' },
      });
      expect(prisma.landPlot.findUnique).toHaveBeenCalledWith({
        where: { id: 'plot-1' },
      });
      expect(prisma.workerAssignment.create).toHaveBeenCalledWith({
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
      expect(result).toEqual(mockAssignment);
    });
  });

  describe('findAll', () => {
    it('should return paginated assignments', async () => {
      const mockAssignments = [
        {
          id: 'assignment-1',
          workDate: new Date('2024-01-15T08:00:00Z'),
          startTime: new Date('2024-01-15T08:00:00Z'),
          endTime: new Date('2024-01-15T12:00:00Z'),
          hourlyRate: 15.0,
          task: 'Soil preparation for tomato planting',
          landArea: 100.0,
          cropType: 'Tomato',
          status: WorkStatus.ASSIGNED,
          paymentStatus: PaymentStatus.PENDING,
          workerId: 'worker-1',
          landPlotId: 'plot-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(prisma.workerAssignment, 'findMany').mockResolvedValue(mockAssignments);
      jest.spyOn(prisma.workerAssignment, 'count').mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 }, {});

      expect(prisma.workerAssignment.findMany).toHaveBeenCalled();
      expect(prisma.workerAssignment.count).toHaveBeenCalled();
      expect(result.meta.total).toBe(1);
      expect(result.data).toEqual(mockAssignments);
    });
  });

  describe('findOne', () => {
    it('should return an assignment by id', async () => {
      const mockAssignment = {
        id: 'assignment-1',
        workDate: new Date('2024-01-15T08:00:00Z'),
        startTime: new Date('2024-01-15T08:00:00Z'),
        endTime: new Date('2024-01-15T12:00:00Z'),
        hourlyRate: 15.0,
        task: 'Soil preparation for tomato planting',
        landArea: 100.0,
        cropType: 'Tomato',
        status: WorkStatus.ASSIGNED,
        paymentStatus: PaymentStatus.PENDING,
        workerId: 'worker-1',
        landPlotId: 'plot-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.workerAssignment, 'findUnique').mockResolvedValue(mockAssignment);

      const result = await service.findOne('assignment-1');

      expect(prisma.workerAssignment.findUnique).toHaveBeenCalledWith({
        where: { id: 'assignment-1' },
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
      expect(result).toEqual(mockAssignment);
    });
  });

  describe('update', () => {
    it('should update an assignment', async () => {
      const updateAssignmentDto: UpdateAssignmentDto = {
        task: 'Updated task description',
        status: WorkStatus.IN_PROGRESS,
        paymentStatus: PaymentStatus.PAID,
      };

      const mockAssignment = {
        id: 'assignment-1',
        workDate: new Date('2024-01-15T08:00:00Z'),
        startTime: new Date('2024-01-15T08:00:00Z'),
        endTime: new Date('2024-01-15T12:00:00Z'),
        hourlyRate: 15.0,
        task: 'Updated task description',
        landArea: 100.0,
        cropType: 'Tomato',
        status: WorkStatus.IN_PROGRESS,
        paymentStatus: PaymentStatus.PAID,
        workerId: 'worker-1',
        landPlotId: 'plot-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.workerAssignment, 'findUnique').mockResolvedValue(mockAssignment);
      jest.spyOn(prisma.workerAssignment, 'update').mockResolvedValue(mockAssignment);

      const result = await service.update('assignment-1', updateAssignmentDto);

      expect(prisma.workerAssignment.update).toHaveBeenCalledWith({
        where: { id: 'assignment-1' },
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
      expect(result).toEqual(mockAssignment);
    });
  });

  describe('remove', () => {
    it('should delete an assignment', async () => {
      const mockAssignment = {
        id: 'assignment-1',
        workDate: new Date('2024-01-15T08:00:00Z'),
        startTime: new Date('2024-01-15T08:00:00Z'),
        endTime: new Date('2024-01-15T12:00:00Z'),
        hourlyRate: 15.0,
        task: 'Soil preparation for tomato planting',
        landArea: 100.0,
        cropType: 'Tomato',
        status: WorkStatus.ASSIGNED,
        paymentStatus: PaymentStatus.PENDING,
        workerId: 'worker-1',
        landPlotId: 'plot-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.workerAssignment, 'findUnique').mockResolvedValue(mockAssignment);
      jest.spyOn(prisma.workerAssignment, 'delete').mockResolvedValue(mockAssignment);

      const result = await service.remove('assignment-1');

      expect(prisma.workerAssignment.delete).toHaveBeenCalledWith({
        where: { id: 'assignment-1' },
      });
      expect(result).toEqual(mockAssignment);
    });
  });

  describe('getWorkerAssignments', () => {
    it('should return assignments for a specific worker', async () => {
      const mockWorker = {
        id: 'worker-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        password: 'hashedpassword',
        role: Role.WORKER,
        status: UserStatus.WORKING,
        expertise: { skills: ['plowing', 'planting'] },
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockAssignments = [
        {
          id: 'assignment-1',
          workDate: new Date('2024-01-15T08:00:00Z'),
          startTime: new Date('2024-01-15T08:00:00Z'),
          endTime: new Date('2024-01-15T12:00:00Z'),
          hourlyRate: 15.0,
          task: 'Soil preparation for tomato planting',
          landArea: 100.0,
          cropType: 'Tomato',
          status: WorkStatus.ASSIGNED,
          paymentStatus: PaymentStatus.PENDING,
          workerId: 'worker-1',
          landPlotId: 'plot-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockWorker);
      jest.spyOn(prisma.workerAssignment, 'findMany').mockResolvedValue(mockAssignments);

      const result = await service.getWorkerAssignments('worker-1');

      expect(prisma.workerAssignment.findMany).toHaveBeenCalledWith({
        where: { workerId: 'worker-1' },
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
      expect(result).toEqual(mockAssignments);
    });
  });

  describe('getAssignmentStatistics', () => {
    it('should return assignment statistics', async () => {
      jest.spyOn(prisma.workerAssignment, 'count').mockResolvedValue(30);
      jest.spyOn(prisma.workerAssignment, 'groupBy').mockResolvedValue([
        { 
          status: WorkStatus.ASSIGNED,
          _count: { id: 10 },
          _avg: { hourlyRate: 15.0 },
          _max: { hourlyRate: 20.0 },
          _min: { hourlyRate: 10.0 },
          _sum: { hourlyRate: 150.0 }
        } as any,
        { 
          status: WorkStatus.IN_PROGRESS,
          _count: { id: 5 },
          _avg: { hourlyRate: 16.0 },
          _max: { hourlyRate: 18.0 },
          _min: { hourlyRate: 14.0 },
          _sum: { hourlyRate: 80.0 }
        } as any,
        { 
          status: WorkStatus.COMPLETED,
          _count: { id: 15 },
          _avg: { hourlyRate: 17.0 },
          _max: { hourlyRate: 25.0 },
          _min: { hourlyRate: 12.0 },
          _sum: { hourlyRate: 255.0 }
        } as any,
      ]);

      const result = await service.getAssignmentStatistics();

      expect(prisma.workerAssignment.count).toHaveBeenCalled();
      expect(prisma.workerAssignment.groupBy).toHaveBeenCalledWith({
        by: ['status'],
        _count: {
          id: true,
        },
      });
      expect(result).toBeDefined();
    });
  });
}); 