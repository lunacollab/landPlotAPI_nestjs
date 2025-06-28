import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrismaService } from '../../prisma/prisma.service';
import { LandStatus } from '@prisma/client';

describe('ReportsService', () => {
  let service: ReportsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    landPlot: {
      findMany: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    assignment: {
      findMany: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    service: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLandPlotReport', () => {
    it('should return land plot report', async () => {
      const mockLandPlots = [
        {
          id: 'plot-1',
          name: 'Plot 1',
          area: 100,
          status: LandStatus.IN_USE,
          zoneId: 'zone-1',
          zone: { name: 'Zone A', color: '#FF0000' },
        },
        {
          id: 'plot-2',
          name: 'Plot 2',
          area: 150,
          status: LandStatus.EMPTY,
          zoneId: 'zone-2',
          zone: { name: 'Zone B', color: '#00FF00' },
        },
      ];

      jest.spyOn(prisma.landPlot, 'findMany').mockResolvedValue(mockLandPlots as any);
      jest.spyOn(prisma.landPlot, 'count').mockResolvedValue(2);

      const result = await service.getLandPlotReport();

      expect(result.summary.totalLandPlots).toBe(2);
      expect(result.summary.totalArea).toBe(250);
      expect(result.byStatus).toHaveLength(2);
      expect(result.byZone).toHaveLength(2);
    });
  });

  describe('getWorkerReport', () => {
    it('should return worker report', async () => {
      const mockAssignments = [
        {
          id: 'assignment-1',
          status: 'COMPLETED',
          workerId: 'worker-1',
          worker: {
            id: 'worker-1',
            name: 'John Doe',
            email: 'john@example.com',
            status: 'ACTIVE',
          },
          totalPay: 100,
        },
        {
          id: 'assignment-2',
          status: 'COMPLETED',
          workerId: 'worker-2',
          worker: {
            id: 'worker-2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            status: 'ACTIVE',
          },
          totalPay: 150,
        },
      ];

      const mockWorkers = [
        {
          id: 'worker-1',
          name: 'John Doe',
          email: 'john@example.com',
          status: 'ACTIVE',
        },
        {
          id: 'worker-2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          status: 'ACTIVE',
        },
      ];

      jest.spyOn(prisma.assignment, 'findMany').mockResolvedValue(mockAssignments as any);
      jest.spyOn(prisma.user, 'findMany').mockResolvedValue(mockWorkers as any);
      jest.spyOn(prisma.user, 'count').mockResolvedValue(2);
      jest.spyOn(prisma.assignment, 'count').mockResolvedValue(2);

      const result = await service.getWorkerReport();

      expect(result.summary.totalWorkers).toBe(2);
      expect(result.summary.totalAssignments).toBe(2);
      expect(result.summary.totalCompleted).toBe(2);
      expect(result.byWorker).toHaveLength(2);
      expect(result.topPerformers).toHaveLength(2);
    });
  });

  describe('getFinancialReport', () => {
    it('should return financial report', async () => {
      const mockAssignments = [
        {
          id: 'assignment-1',
          totalPay: 100,
          createdAt: new Date('2024-01-01'),
        },
        {
          id: 'assignment-2',
          totalPay: 150,
          createdAt: new Date('2024-01-01'),
        },
      ];

      const mockServices = [
        {
          id: 'service-1',
          cost: 500,
          createdAt: new Date('2024-01-01'),
        },
        {
          id: 'service-2',
          cost: 1000,
          createdAt: new Date('2024-01-01'),
        },
      ];

      jest.spyOn(prisma.assignment, 'findMany').mockResolvedValue(mockAssignments as any);
      jest.spyOn(prisma.service, 'findMany').mockResolvedValue(mockServices as any);
      jest.spyOn(prisma.assignment, 'count').mockResolvedValue(2);
      jest.spyOn(prisma.service, 'count').mockResolvedValue(2);

      const result = await service.getFinancialReport();

      expect(result.summary.totalWorkerCosts).toBe(250);
      expect(result.summary.totalServiceCosts).toBe(1500);
      expect(result.summary.totalCosts).toBe(1750);
      expect(result.summary.totalAssignments).toBe(2);
      expect(result.summary.totalServices).toBe(2);
      expect(result.monthlyBreakdown).toHaveLength(1);
    });
  });
}); 