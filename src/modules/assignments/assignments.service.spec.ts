import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsService } from './assignments.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAssignmentDto, UpdateAssignmentDto } from './dto/assignment.dto';
import { Assignment, WorkStatus, PaymentStatus } from '@prisma/client';

describe('AssignmentsService', () => {
  let service: AssignmentsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    assignment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignmentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AssignmentsService>(AssignmentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new assignment', async () => {
      const createAssignmentDto: CreateAssignmentDto = {
        title: 'Test Assignment',
        description: 'Test Description',
        workerId: 'worker-1',
        landPlotId: 'plot-1',
        startDate: new Date(),
        endDate: new Date(),
        estimatedHours: 8,
        hourlyRate: 15,
      };

      const mockAssignment: Assignment = {
        id: 'assignment-1',
        title: 'Test Assignment',
        description: 'Test Description',
        workerId: 'worker-1',
        landPlotId: 'plot-1',
        startDate: new Date(),
        endDate: new Date(),
        estimatedHours: 8,
        hourlyRate: 15,
        status: WorkStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        actualHours: null,
        totalPay: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.assignment, 'create').mockResolvedValue(mockAssignment);

      const result = await service.create(createAssignmentDto);

      expect(prisma.assignment.create).toHaveBeenCalledWith({
        data: createAssignmentDto,
      });
      expect(result).toEqual(mockAssignment);
    });
  });

  describe('findAll', () => {
    it('should return all assignments', async () => {
      const mockAssignments: Assignment[] = [
        {
          id: 'assignment-1',
          title: 'Assignment 1',
          description: 'Description 1',
          workerId: 'worker-1',
          landPlotId: 'plot-1',
          startDate: new Date(),
          endDate: new Date(),
          estimatedHours: 8,
          hourlyRate: 15,
          status: WorkStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          actualHours: null,
          totalPay: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'assignment-2',
          title: 'Assignment 2',
          description: 'Description 2',
          workerId: 'worker-2',
          landPlotId: 'plot-2',
          startDate: new Date(),
          endDate: new Date(),
          estimatedHours: 6,
          hourlyRate: 12,
          status: WorkStatus.IN_PROGRESS,
          paymentStatus: PaymentStatus.PENDING,
          actualHours: null,
          totalPay: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(prisma.assignment, 'findMany').mockResolvedValue(mockAssignments);
      jest.spyOn(prisma.assignment, 'count').mockResolvedValue(2);

      const result = await service.findAll({});

      expect(prisma.assignment.findMany).toHaveBeenCalled();
      expect(result.data).toEqual(mockAssignments);
      expect(result.total).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should return an assignment by id', async () => {
      const mockAssignment: Assignment = {
        id: 'assignment-1',
        title: 'Test Assignment',
        description: 'Test Description',
        workerId: 'worker-1',
        landPlotId: 'plot-1',
        startDate: new Date(),
        endDate: new Date(),
        estimatedHours: 8,
        hourlyRate: 15,
        status: WorkStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        actualHours: null,
        totalPay: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.assignment, 'findUnique').mockResolvedValue(mockAssignment);

      const result = await service.findOne('assignment-1');

      expect(prisma.assignment.findUnique).toHaveBeenCalledWith({
        where: { id: 'assignment-1' },
      });
      expect(result).toEqual(mockAssignment);
    });
  });

  describe('update', () => {
    it('should update an assignment', async () => {
      const updateAssignmentDto: UpdateAssignmentDto = {
        title: 'Updated Assignment',
        description: 'Updated Description',
      };

      const mockAssignment: Assignment = {
        id: 'assignment-1',
        title: 'Updated Assignment',
        description: 'Updated Description',
        workerId: 'worker-1',
        landPlotId: 'plot-1',
        startDate: new Date(),
        endDate: new Date(),
        estimatedHours: 8,
        hourlyRate: 15,
        status: WorkStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        actualHours: null,
        totalPay: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.assignment, 'update').mockResolvedValue(mockAssignment);

      const result = await service.update('assignment-1', updateAssignmentDto);

      expect(prisma.assignment.update).toHaveBeenCalledWith({
        where: { id: 'assignment-1' },
        data: updateAssignmentDto,
      });
      expect(result).toEqual(mockAssignment);
    });
  });

  describe('remove', () => {
    it('should delete an assignment', async () => {
      const mockAssignment: Assignment = {
        id: 'assignment-1',
        title: 'Test Assignment',
        description: 'Test Description',
        workerId: 'worker-1',
        landPlotId: 'plot-1',
        startDate: new Date(),
        endDate: new Date(),
        estimatedHours: 8,
        hourlyRate: 15,
        status: WorkStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        actualHours: null,
        totalPay: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.assignment, 'delete').mockResolvedValue(mockAssignment);

      const result = await service.remove('assignment-1');

      expect(prisma.assignment.delete).toHaveBeenCalledWith({
        where: { id: 'assignment-1' },
      });
      expect(result).toEqual(mockAssignment);
    });
  });

  describe('getAssignmentsByWorker', () => {
    it('should return assignments for a specific worker', async () => {
      const mockAssignments: Assignment[] = [
        {
          id: 'assignment-1',
          title: 'Assignment 1',
          description: 'Description 1',
          workerId: 'worker-1',
          landPlotId: 'plot-1',
          startDate: new Date(),
          endDate: new Date(),
          estimatedHours: 8,
          hourlyRate: 15,
          status: WorkStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          actualHours: null,
          totalPay: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(prisma.assignment, 'findMany').mockResolvedValue(mockAssignments);

      const result = await service.getAssignmentsByWorker('worker-1');

      expect(prisma.assignment.findMany).toHaveBeenCalledWith({
        where: { workerId: 'worker-1' },
        include: {
          worker: true,
          landPlot: true,
        },
      });
      expect(result).toEqual(mockAssignments);
    });
  });

  describe('getAssignmentsByLandPlot', () => {
    it('should return assignments for a specific land plot', async () => {
      const mockAssignments: Assignment[] = [
        {
          id: 'assignment-1',
          title: 'Assignment 1',
          description: 'Description 1',
          workerId: 'worker-1',
          landPlotId: 'plot-1',
          startDate: new Date(),
          endDate: new Date(),
          estimatedHours: 8,
          hourlyRate: 15,
          status: WorkStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          actualHours: null,
          totalPay: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(prisma.assignment, 'findMany').mockResolvedValue(mockAssignments);

      const result = await service.getAssignmentsByLandPlot('plot-1');

      expect(prisma.assignment.findMany).toHaveBeenCalledWith({
        where: { landPlotId: 'plot-1' },
        include: {
          worker: true,
          landPlot: true,
        },
      });
      expect(result).toEqual(mockAssignments);
    });
  });

  describe('getAssignmentStats', () => {
    it('should return assignment statistics', async () => {
      const mockStats = {
        totalAssignments: 15,
        assignmentsByStatus: [
          { status: WorkStatus.PENDING, count: 10 },
          { status: WorkStatus.IN_PROGRESS, count: 3 },
          { status: WorkStatus.COMPLETED, count: 2 },
        ],
        assignmentsByPaymentStatus: [
          { paymentStatus: PaymentStatus.PENDING, count: 12 },
          { paymentStatus: PaymentStatus.PAID, count: 3 },
        ],
      };

      jest.spyOn(prisma.assignment, 'count').mockResolvedValue(15);
      jest.spyOn(prisma.assignment, 'groupBy').mockResolvedValue([
        { status: WorkStatus.PENDING, _count: { status: 10 } },
        { status: WorkStatus.IN_PROGRESS, _count: { status: 3 } },
        { status: WorkStatus.COMPLETED, _count: { status: 2 } },
      ] as any);

      const result = await service.getAssignmentStats();

      expect(result.totalAssignments).toBe(15);
      expect(result.assignmentsByStatus).toHaveLength(3);
      expect(result.assignmentsByPaymentStatus).toHaveLength(2);
    });
  });
}); 