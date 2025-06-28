import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ResourceNotFoundException, ConflictException } from '../../common/exceptions/custom.exception';
import { ServiceStatus } from '@prisma/client';

describe('ServicesService', () => {
  let service: ServicesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    service: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createServiceDto = {
      code: 'SOIL_PREP',
      name: 'Soil Preparation',
      costPerSqm: 2.5,
      duration: 4,
    };

    it('should create a new service successfully', async () => {
      const mockCreatedService = { id: 'service-1', ...createServiceDto };

      mockPrismaService.service.findFirst.mockResolvedValue(null);
      mockPrismaService.service.create.mockResolvedValue(mockCreatedService);

      const result = await service.create(createServiceDto);

      expect(result).toEqual(mockCreatedService);
      expect(mockPrismaService.service.findFirst).toHaveBeenCalledWith({
        where: { code: createServiceDto.code },
      });
      expect(mockPrismaService.service.create).toHaveBeenCalledWith({
        data: createServiceDto,
        include: expect.any(Object),
      });
    });

    it('should throw ConflictException if service with same code exists', async () => {
      const mockExistingService = { id: 'service-1', code: 'SOIL_PREP' };

      mockPrismaService.service.findFirst.mockResolvedValue(mockExistingService);

      await expect(service.create(createServiceDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findOne', () => {
    it('should return service by id', async () => {
      const mockService = { id: 'service-1', name: 'Soil Preparation' };

      mockPrismaService.service.findUnique.mockResolvedValue(mockService);

      const result = await service.findOne('service-1');

      expect(result).toEqual(mockService);
      expect(mockPrismaService.service.findUnique).toHaveBeenCalledWith({
        where: { id: 'service-1' },
        include: expect.any(Object),
      });
    });

    it('should throw ResourceNotFoundException if service not found', async () => {
      mockPrismaService.service.findUnique.mockResolvedValue(null);

      await expect(service.findOne('service-1')).rejects.toThrow(
        ResourceNotFoundException,
      );
    });
  });

  describe('getActiveServices', () => {
    it('should return active services', async () => {
      const mockServices = [
        { id: 'service-1', name: 'Soil Preparation', status: ServiceStatus.ACTIVE },
        { id: 'service-2', name: 'Planting', status: ServiceStatus.ACTIVE },
      ];

      mockPrismaService.service.findMany.mockResolvedValue(mockServices);

      const result = await service.getActiveServices();

      expect(result).toEqual(mockServices);
      expect(mockPrismaService.service.findMany).toHaveBeenCalledWith({
        where: { status: 'ACTIVE' },
        include: expect.any(Object),
      });
    });
  });

  describe('calculateServiceCost', () => {
    it('should calculate service cost correctly', async () => {
      const mockService = {
        id: 'service-1',
        name: 'Soil Preparation',
        costPerSqm: 2.5,
        duration: 4,
      };

      mockPrismaService.service.findUnique.mockResolvedValue(mockService);

      const result = await service.calculateServiceCost('service-1', 100);

      expect(result).toEqual({
        serviceId: 'service-1',
        serviceName: 'Soil Preparation',
        area: 100,
        costPerSqm: 2.5,
        totalCost: 250,
        duration: 4,
      });
    });

    it('should throw ResourceNotFoundException if service not found', async () => {
      mockPrismaService.service.findUnique.mockResolvedValue(null);

      await expect(service.calculateServiceCost('service-1', 100)).rejects.toThrow(
        ResourceNotFoundException,
      );
    });
  });

  describe('getServiceStatistics', () => {
    it('should return service statistics', async () => {
      mockPrismaService.service.count
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(8);
      mockPrismaService.service.groupBy.mockResolvedValue([
        { status: ServiceStatus.ACTIVE, _count: { id: 8 } },
        { status: ServiceStatus.INACTIVE, _count: { id: 2 } },
      ]);

      const result = await service.getServiceStatistics();

      expect(result.totalServices).toBe(10);
      expect(result.activeServices).toBe(8);
      expect(result.inactiveServices).toBe(2);
      expect(result.servicesByStatus).toHaveLength(2);
    });
  });
}); 