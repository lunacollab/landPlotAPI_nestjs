import { Test, TestingModule } from '@nestjs/testing';
import { LandPlotsService } from './land-plots.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ResourceNotFoundException, ConflictException } from '../../common/exceptions/custom.exception';
import { LandStatus } from '@prisma/client';

describe('LandPlotsService', () => {
  let service: LandPlotsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    landPlot: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    zone: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LandPlotsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<LandPlotsService>(LandPlotsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createLandPlotDto = {
      name: 'Test Plot',
      soilType: 'Loamy',
      area: 100,
      zoneId: 'zone-1',
    };

    it('should create a new land plot successfully', async () => {
      const mockZone = { id: 'zone-1', name: 'Zone A' };
      const mockCreatedPlot = { id: 'plot-1', ...createLandPlotDto };

      mockPrismaService.zone.findUnique.mockResolvedValue(mockZone);
      mockPrismaService.landPlot.findFirst.mockResolvedValue(null);
      mockPrismaService.landPlot.create.mockResolvedValue(mockCreatedPlot);

      const result = await service.create(createLandPlotDto);

      expect(result).toEqual(mockCreatedPlot);
      expect(mockPrismaService.zone.findUnique).toHaveBeenCalledWith({
        where: { id: createLandPlotDto.zoneId },
      });
      expect(mockPrismaService.landPlot.create).toHaveBeenCalledWith({
        data: createLandPlotDto,
        include: expect.any(Object),
      });
    });

    it('should throw ResourceNotFoundException if zone not exists', async () => {
      mockPrismaService.zone.findUnique.mockResolvedValue(null);

      await expect(service.create(createLandPlotDto)).rejects.toThrow(
        ResourceNotFoundException,
      );
    });

    it('should throw ConflictException if land plot with same name exists in zone', async () => {
      const mockZone = { id: 'zone-1', name: 'Zone A' };
      const mockExistingPlot = { id: 'plot-1', name: 'Test Plot' };

      mockPrismaService.zone.findUnique.mockResolvedValue(mockZone);
      mockPrismaService.landPlot.findFirst.mockResolvedValue(mockExistingPlot);

      await expect(service.create(createLandPlotDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findOne', () => {
    it('should return land plot by id', async () => {
      const mockLandPlot = { id: 'plot-1', name: 'Test Plot' };

      mockPrismaService.landPlot.findUnique.mockResolvedValue(mockLandPlot);

      const result = await service.findOne('plot-1');

      expect(result).toEqual(mockLandPlot);
      expect(mockPrismaService.landPlot.findUnique).toHaveBeenCalledWith({
        where: { id: 'plot-1' },
        include: expect.any(Object),
      });
    });

    it('should throw ResourceNotFoundException if land plot not found', async () => {
      mockPrismaService.landPlot.findUnique.mockResolvedValue(null);

      await expect(service.findOne('plot-1')).rejects.toThrow(
        ResourceNotFoundException,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update land plot status', async () => {
      const mockLandPlot = { id: 'plot-1', name: 'Test Plot' };
      const mockUpdatedPlot = { ...mockLandPlot, status: LandStatus.IN_USE };

      mockPrismaService.landPlot.findUnique.mockResolvedValue(mockLandPlot);
      mockPrismaService.landPlot.update.mockResolvedValue(mockUpdatedPlot);

      const result = await service.updateStatus('plot-1', LandStatus.IN_USE);

      expect(result).toEqual(mockUpdatedPlot);
      expect(mockPrismaService.landPlot.update).toHaveBeenCalledWith({
        where: { id: 'plot-1' },
        data: { status: LandStatus.IN_USE },
        include: expect.any(Object),
      });
    });

    it('should throw ResourceNotFoundException if land plot not found', async () => {
      mockPrismaService.landPlot.findUnique.mockResolvedValue(null);

      await expect(service.updateStatus('plot-1', LandStatus.IN_USE)).rejects.toThrow(
        ResourceNotFoundException,
      );
    });
  });
}); 