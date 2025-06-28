import { Test, TestingModule } from '@nestjs/testing';
import { MapController } from './map.controller';
import { MapService } from './map.service';

describe('MapController', () => {
  let controller: MapController;
  let service: MapService;

  const mockService = {
    getZoneMapData: jest.fn(),
    getLandPlotCoordinates: jest.fn(),
    getLandPlotHighlight: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MapController],
      providers: [
        {
          provide: MapService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<MapController>(MapController);
    service = module.get<MapService>(MapService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getZoneMapData', () => {
    it('should return zone map data', async () => {
      const mockData = [{ id: 'zone-1', name: 'A' }];
      mockService.getZoneMapData.mockResolvedValue(mockData);
      expect(await controller.getZoneMapData()).toEqual(mockData);
    });
  });

  describe('getLandPlotCoordinates', () => {
    it('should return land plot coordinates', async () => {
      const mockData = [{ id: 'plot-1', name: 'Plot 1' }];
      mockService.getLandPlotCoordinates.mockResolvedValue(mockData);
      expect(await controller.getLandPlotCoordinates()).toEqual(mockData);
    });
  });

  describe('highlightLandPlot', () => {
    it.skip('should highlight land plot', async () => {
      // Đã xóa method highlightLandPlot
    });
  });
}); 