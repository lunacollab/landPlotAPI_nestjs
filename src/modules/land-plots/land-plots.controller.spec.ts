import { Test, TestingModule } from '@nestjs/testing';
import { LandPlotsController } from './land-plots.controller';
import { LandPlotsService } from './land-plots.service';
import { CreateLandPlotDto, UpdateLandPlotDto } from './dto/land-plot.dto';
import { ResourceNotFoundException } from '../../common/exceptions/custom.exception';

describe('LandPlotsController', () => {
  let controller: LandPlotsController;
  let service: LandPlotsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    uploadImages: jest.fn(),
    getHistory: jest.fn(),
    getSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LandPlotsController],
      providers: [
        {
          provide: LandPlotsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<LandPlotsController>(LandPlotsController);
    service = module.get<LandPlotsService>(LandPlotsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a land plot', async () => {
      const dto: CreateLandPlotDto = { name: 'Plot 1', soilType: 'Sandy', area: 100, zoneId: 'zone-1' };
      const mockPlot = { id: 'plot-1', ...dto };
      mockService.create.mockResolvedValue(mockPlot);
      expect(await controller.create(dto)).toEqual(mockPlot);
    });
  });

  describe('findAll', () => {
    it('should return all land plots', async () => {
      const mockPlots = [
        { id: 'plot-1', name: 'Plot 1' },
        { id: 'plot-2', name: 'Plot 2' },
      ];
      mockService.findAll.mockResolvedValue(mockPlots);
      expect(await controller.findAll({}, {})).toEqual(mockPlots);
    });
  });

  describe('findOne', () => {
    it('should return a land plot by id', async () => {
      const mockPlot = { id: 'plot-1', name: 'Plot 1' };
      mockService.findOne.mockResolvedValue(mockPlot);
      expect(await controller.findOne('plot-1')).toEqual(mockPlot);
    });
    it('should throw ResourceNotFoundException if not found', async () => {
      mockService.findOne.mockRejectedValue(new ResourceNotFoundException('Not found'));
      await expect(controller.findOne('plot-404')).rejects.toThrow(ResourceNotFoundException);
    });
  });

  describe('update', () => {
    it('should update a land plot', async () => {
      const dto: UpdateLandPlotDto = { name: 'Plot 1 Updated' };
      const mockPlot = { id: 'plot-1', ...dto };
      mockService.update.mockResolvedValue(mockPlot);
      expect(await controller.update('plot-1', dto)).toEqual(mockPlot);
    });
  });

  describe('remove', () => {
    it('should remove a land plot', async () => {
      mockService.remove.mockResolvedValue({ id: 'plot-1' });
      expect(await controller.remove('plot-1')).toEqual({ id: 'plot-1' });
    });
  });

  describe('uploadImage', () => {
    it.skip('should upload image', async () => {
      // Method uploadImage không còn tồn tại trong service
    });
  });

  describe('getHistory', () => {
    it('should return land plot history', async () => {
      const mockHistory = [{ season: '2023-Q1', crop: 'Tomato' }];
      mockService.getHistory.mockResolvedValue(mockHistory);
      expect(await controller.getHistory('plot-1')).toEqual(mockHistory);
    });
  });

  describe('getSchedule', () => {
    it('should return land plot schedule', async () => {
      const mockSchedule = [{ season: '2024-Q1', status: 'LOCKED' }];
      mockService.getSchedule.mockResolvedValue(mockSchedule);
      expect(await controller.getSchedule('plot-1')).toEqual(mockSchedule);
    });
  });
}); 