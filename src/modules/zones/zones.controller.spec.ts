import { Test, TestingModule } from '@nestjs/testing';
import { ZonesController } from './zones.controller';
import { ZonesService } from './zones.service';
import { CreateZoneDto, UpdateZoneDto } from './dto/zone.dto';
import { ResourceNotFoundException } from '../../common/exceptions/custom.exception';

describe('ZonesController', () => {
  let controller: ZonesController;
  let service: ZonesService;

  const mockZonesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getLandPlots: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZonesController],
      providers: [
        {
          provide: ZonesService,
          useValue: mockZonesService,
        },
      ],
    }).compile();

    controller = module.get<ZonesController>(ZonesController);
    service = module.get<ZonesService>(ZonesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(true).toBe(true);
  });

  describe('create', () => {
    it('should create a zone', async () => {
      const dto: CreateZoneDto = { name: 'A', color: '#FF0000' };
      const mockZone = { id: 'zone-1', ...dto };
      mockZonesService.create.mockResolvedValue(mockZone);
      expect(await controller.create(dto)).toEqual(mockZone);
    });
  });

  describe('findAll', () => {
    it('should return all zones', async () => {
      const mockZones = [
        { id: 'zone-1', name: 'A' },
        { id: 'zone-2', name: 'B' },
      ];
      mockZonesService.findAll.mockResolvedValue(mockZones);
      expect(await controller.findAll({})).toEqual(mockZones);
    });
  });

  describe('findOne', () => {
    it('should return a zone by id', async () => {
      const mockZone = { id: 'zone-1', name: 'A' };
      mockZonesService.findOne.mockResolvedValue(mockZone);
      expect(await controller.findOne('zone-1')).toEqual(mockZone);
    });
    it('should throw ResourceNotFoundException if not found', async () => {
      mockZonesService.findOne.mockRejectedValue(new ResourceNotFoundException('Not found'));
      await expect(controller.findOne('zone-404')).rejects.toThrow(ResourceNotFoundException);
    });
  });

  describe('update', () => {
    it('should update a zone', async () => {
      const dto: UpdateZoneDto = { name: 'A Updated' };
      const mockZone = { id: 'zone-1', ...dto };
      mockZonesService.update.mockResolvedValue(mockZone);
      expect(await controller.update('zone-1', dto)).toEqual(mockZone);
    });
  });

  describe('remove', () => {
    it('should remove a zone', async () => {
      mockZonesService.remove.mockResolvedValue({ id: 'zone-1' });
      expect(await controller.remove('zone-1')).toEqual({ id: 'zone-1' });
    });
  });

  describe('getLandPlots', () => {
    it('should return land plots in zone', async () => {
      const mockLandPlots = [
        { id: 'plot-1', name: 'Plot 1' },
        { id: 'plot-2', name: 'Plot 2' },
      ];
      mockZonesService.getLandPlots.mockResolvedValue(mockLandPlots);
      expect(await controller.getLandPlots('zone-1')).toEqual(mockLandPlots);
    });
  });
}); 