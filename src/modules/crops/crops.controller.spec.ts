import { Test, TestingModule } from '@nestjs/testing';
import { CropsController } from './crops.controller';
import { CropsService } from './crops.service';
import { CreateCropDto, UpdateCropDto } from './dto/crop.dto';
import { CropCategory, CropStatus } from '@prisma/client';
import { ResourceNotFoundException, ConflictException } from '../../common/exceptions/custom.exception';

describe('CropsController', () => {
  let controller: CropsController;
  let service: CropsService;

  const mockCropsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getCategories: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CropsController],
      providers: [
        {
          provide: CropsService,
          useValue: mockCropsService,
        },
      ],
    }).compile();

    controller = module.get<CropsController>(CropsController);
    service = module.get<CropsService>(CropsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a crop', async () => {
      const dto: CreateCropDto = {
        name: 'Tomato',
        category: CropCategory.ROOT_VEGETABLE,
        varietyCount: 2,
        daysToHarvest: 90,
      };
      const mockCrop = { id: 'crop-1', ...dto };
      mockCropsService.create.mockResolvedValue(mockCrop);
      expect(await controller.create(dto)).toEqual(mockCrop);
    });
  });

  describe('findAll', () => {
    it('should return all crops', async () => {
      const mockCrops = [
        { id: 'crop-1', name: 'Tomato' },
        { id: 'crop-2', name: 'Corn' },
      ];
      mockCropsService.findAll.mockResolvedValue(mockCrops);
      expect(await controller.findAll({}, {})).toEqual(mockCrops);
    });
  });

  describe('findOne', () => {
    it('should return a crop by id', async () => {
      const mockCrop = { id: 'crop-1', name: 'Tomato' };
      mockCropsService.findOne.mockResolvedValue(mockCrop);
      expect(await controller.findOne('crop-1')).toEqual(mockCrop);
    });
    it('should throw ResourceNotFoundException if not found', async () => {
      mockCropsService.findOne.mockRejectedValue(new ResourceNotFoundException('Not found'));
      await expect(controller.findOne('crop-404')).rejects.toThrow(ResourceNotFoundException);
    });
  });

  describe('update', () => {
    it('should update a crop', async () => {
      const dto: UpdateCropDto = { name: 'Tomato Updated' };
      const mockCrop = { id: 'crop-1', ...dto };
      mockCropsService.update.mockResolvedValue(mockCrop);
      expect(await controller.update('crop-1', dto)).toEqual(mockCrop);
    });
  });

  describe('remove', () => {
    it('should remove a crop', async () => {
      mockCropsService.remove.mockResolvedValue({ id: 'crop-1' });
      expect(await controller.remove('crop-1')).toEqual({ id: 'crop-1' });
    });
  });

  describe('getCategories', () => {
    it('should return crop categories', async () => {
      const mockCategories = [
        { value: 'FRUIT', label: 'fruit' },
        { value: 'VEGETABLE', label: 'vegetable' },
      ];
      mockCropsService.getCategories.mockReturnValue(mockCategories);
      expect(controller.getCategories()).toEqual(mockCategories);
    });
  });
}); 