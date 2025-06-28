import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { ResourceNotFoundException } from '../../common/exceptions/custom.exception';

describe('ServicesController', () => {
  let controller: ServicesController;
  let service: ServicesService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        {
          provide: ServicesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ServicesController>(ServicesController);
    service = module.get<ServicesService>(ServicesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a service', async () => {
      const dto: CreateServiceDto = { code: 'SOIL', name: 'Soil Prep', costPerSqm: 2, duration: 4 };
      const mockObj = { id: 'service-1', ...dto };
      mockService.create.mockResolvedValue(mockObj);
      expect(await controller.create(dto)).toEqual(mockObj);
    });
  });

  describe('findAll', () => {
    it('should return all services', async () => {
      const mockArr = [
        { id: 'service-1', name: 'Soil Prep' },
        { id: 'service-2', name: 'Planting' },
      ];
      mockService.findAll.mockResolvedValue(mockArr);
      expect(await controller.findAll({}, {})).toEqual(mockArr);
    });
  });

  describe('findOne', () => {
    it('should return a service by id', async () => {
      const mockObj = { id: 'service-1', name: 'Soil Prep' };
      mockService.findOne.mockResolvedValue(mockObj);
      expect(await controller.findOne('service-1')).toEqual(mockObj);
    });
    it('should throw ResourceNotFoundException if not found', async () => {
      mockService.findOne.mockRejectedValue(new ResourceNotFoundException('Not found'));
      await expect(controller.findOne('service-404')).rejects.toThrow(ResourceNotFoundException);
    });
  });

  describe('update', () => {
    it('should update a service', async () => {
      const dto: UpdateServiceDto = { name: 'Soil Prep Updated' };
      const mockObj = { id: 'service-1', ...dto };
      mockService.update.mockResolvedValue(mockObj);
      expect(await controller.update('service-1', dto)).toEqual(mockObj);
    });
  });

  describe('remove', () => {
    it('should remove a service', async () => {
      mockService.remove.mockResolvedValue({ id: 'service-1' });
      expect(await controller.remove('service-1')).toEqual({ id: 'service-1' });
    });
  });
}); 