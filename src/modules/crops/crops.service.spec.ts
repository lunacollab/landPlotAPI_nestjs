import { Test, TestingModule } from '@nestjs/testing';
import { CropsService } from './crops.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ResourceNotFoundException, ConflictException } from '../../common/exceptions/custom.exception';
import { CropCategory, CropStatus } from '@prisma/client';

describe('CropsService', () => {
  let service: CropsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    crop: {
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
        CropsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CropsService>(CropsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createCropDto = {
      name: 'Tomato',
      category: CropCategory.ROOT_VEGETABLE,
      varietyCount: 3,
      daysToHarvest: 90,
      expectedYield: 25.5,
    };

    it('should create a new crop successfully', async () => {
      const mockCreatedCrop = { id: 'crop-1', ...createCropDto };

      mockPrismaService.crop.findFirst.mockResolvedValue(null);
      mockPrismaService.crop.create.mockResolvedValue(mockCreatedCrop);

      const result = await service.create(createCropDto);

      expect(result).toEqual(mockCreatedCrop);
      expect(mockPrismaService.crop.findFirst).toHaveBeenCalledWith({
        where: { name: createCropDto.name },
      });
      expect(mockPrismaService.crop.create).toHaveBeenCalledWith({
        data: createCropDto,
        include: expect.any(Object),
      });
    });

    it('should throw ConflictException if crop with same name exists', async () => {
      const mockExistingCrop = { id: 'crop-1', name: 'Tomato' };

      mockPrismaService.crop.findFirst.mockResolvedValue(mockExistingCrop);

      await expect(service.create(createCropDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findOne', () => {
    it('should return crop by id', async () => {
      const mockCrop = { id: 'crop-1', name: 'Tomato' };

      mockPrismaService.crop.findUnique.mockResolvedValue(mockCrop);

      const result = await service.findOne('crop-1');

      expect(result).toEqual(mockCrop);
      expect(mockPrismaService.crop.findUnique).toHaveBeenCalledWith({
        where: { id: 'crop-1' },
        include: expect.any(Object),
      });
    });

    it('should throw ResourceNotFoundException if crop not found', async () => {
      mockPrismaService.crop.findUnique.mockResolvedValue(null);

      await expect(service.findOne('crop-1')).rejects.toThrow(
        ResourceNotFoundException,
      );
    });
  });

  describe('getCategories', () => {
    it('should return crop categories', async () => {
      const result = await service.getCategories();
      expect(result).toEqual([
        { value: 'FRUIT', label: 'fruit' },
        { value: 'VEGETABLE', label: 'vegetable' },
        { value: 'ROOT_VEGETABLE', label: 'root vegetable' },
        { value: 'HERB_SPICE', label: 'herb spice' },
      ]);
    });
  });

  describe('getActiveCrops', () => {
    it('should return active crops', async () => {
      const mockCrops = [
        { id: 'crop-1', name: 'Tomato', status: CropStatus.ACTIVE },
        { id: 'crop-2', name: 'Corn', status: CropStatus.ACTIVE },
      ];

      mockPrismaService.crop.findMany.mockResolvedValue(mockCrops);

      const result = await service.getActiveCrops();

      expect(result).toEqual(mockCrops);
      expect(mockPrismaService.crop.findMany).toHaveBeenCalledWith({
        where: { status: 'ACTIVE' },
        include: expect.any(Object),
      });
    });
  });

  describe('getCropStatistics', () => {
    it('should return crop statistics', async () => {
      const mockStats = {
        totalCrops: 10,
        activeCrops: 8,
        inactiveCrops: 2,
        cropsByCategory: [
          { category: CropCategory.FRUIT, count: 3 },
          { category: CropCategory.VEGETABLE, count: 4 },
        ],
      };

      mockPrismaService.crop.count
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(8);
      mockPrismaService.crop.groupBy.mockResolvedValue([
        { category: CropCategory.FRUIT, _count: { id: 3 } },
        { category: CropCategory.VEGETABLE, _count: { id: 4 } },
      ]);

      const result = await service.getCropStatistics();

      expect(result.totalCrops).toBe(10);
      expect(result.activeCrops).toBe(8);
      expect(result.inactiveCrops).toBe(2);
      expect(result.cropsByCategory).toHaveLength(2);
    });
  });
}); 