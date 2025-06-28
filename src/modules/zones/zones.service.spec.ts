import { Test, TestingModule } from '@nestjs/testing';
import { ZonesService } from './zones.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ResourceNotFoundException, ConflictException } from '../../common/exceptions/custom.exception';
import { CreateZoneDto, UpdateZoneDto } from './dto/zone.dto';
import { Zone } from '@prisma/client';

describe('ZonesService', () => {
  let service: ZonesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ZonesService,
        {
          provide: PrismaService,
          useValue: {
            zone: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ZonesService>(ZonesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new zone', async () => {
      const createZoneDto: CreateZoneDto = {
        name: 'Test Zone',
        color: '#FF5733',
        address: 'Test Address',
        coordinates: { lat: 10.762622, lng: 106.660172 },
      };

      const mockZone = {
        id: 'zone-1',
        name: 'Test Zone',
        color: '#FF5733',
        address: 'Test Address',
        coordinates: { lat: 10.762622, lng: 106.660172 },
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: {
          landPlots: 0,
        },
      };

      jest.spyOn(prisma.zone, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prisma.zone, 'create').mockResolvedValue(mockZone);

      const result = await service.create(createZoneDto);

      expect(prisma.zone.findFirst).toHaveBeenCalledWith({
        where: { name: createZoneDto.name },
      });
      expect(prisma.zone.create).toHaveBeenCalledWith({
        data: createZoneDto,
        include: {
          _count: {
            select: {
              landPlots: true,
            },
          },
        },
      });
      expect(result).toEqual(mockZone);
    });
  });

  describe('findAll', () => {
    it('should return paginated zones', async () => {
      const mockZones = [
        {
          id: 'zone-1',
          name: 'Zone A',
          color: '#FF5733',
          address: 'Address 1',
          coordinates: { lat: 10.762622, lng: 106.660172 },
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: {
            landPlots: 2,
          },
        },
        {
          id: 'zone-2',
          name: 'Zone B',
          color: '#33FF57',
          address: 'Address 2',
          coordinates: { lat: 10.762622, lng: 106.660172 },
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: {
            landPlots: 1,
          },
        },
      ];

      jest.spyOn(prisma.zone, 'findMany').mockResolvedValue(mockZones);
      jest.spyOn(prisma.zone, 'count').mockResolvedValue(2);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(prisma.zone.findMany).toHaveBeenCalled();
      expect(prisma.zone.count).toHaveBeenCalled();
      expect(result.meta.total).toBe(2);
      expect(result.data).toEqual(mockZones);
    });
  });

  describe('findOne', () => {
    it('should return a zone by id', async () => {
      const mockZone = {
        id: 'zone-1',
        name: 'Test Zone',
        color: '#FF5733',
        address: 'Test Address',
        coordinates: { lat: 10.762622, lng: 106.660172 },
        createdAt: new Date(),
        updatedAt: new Date(),
        landPlots: [],
        _count: {
          landPlots: 0,
        },
      };

      jest.spyOn(prisma.zone, 'findUnique').mockResolvedValue(mockZone);

      const result = await service.findOne('zone-1');

      expect(prisma.zone.findUnique).toHaveBeenCalledWith({
        where: { id: 'zone-1' },
        include: {
          landPlots: {
            include: {
              crops: {
                include: {
                  crop: true,
                },
              },
              services: {
                include: {
                  service: true,
                },
              },
            },
          },
          _count: {
            select: {
              landPlots: true,
            },
          },
        },
      });
      expect(result).toEqual(mockZone);
    });
  });

  describe('update', () => {
    it('should update a zone', async () => {
      const updateZoneDto: UpdateZoneDto = {
        name: 'Updated Zone',
        color: '#33FF57',
        address: 'Updated Address',
        coordinates: { lat: 10.762622, lng: 106.660172 },
      };

      const existingZone = {
        id: 'zone-1',
        name: 'Test Zone',
        color: '#FF5733',
        address: 'Test Address',
        coordinates: { lat: 10.762622, lng: 106.660172 },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockZone = {
        id: 'zone-1',
        name: 'Updated Zone',
        color: '#33FF57',
        address: 'Updated Address',
        coordinates: { lat: 10.762622, lng: 106.660172 },
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: {
          landPlots: 0,
        },
      };

      jest.spyOn(prisma.zone, 'findUnique').mockResolvedValue(existingZone);
      jest.spyOn(prisma.zone, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prisma.zone, 'update').mockResolvedValue(mockZone);

      const result = await service.update('zone-1', updateZoneDto);

      expect(prisma.zone.update).toHaveBeenCalledWith({
        where: { id: 'zone-1' },
        data: updateZoneDto,
        include: {
          _count: {
            select: {
              landPlots: true,
            },
          },
        },
      });
      expect(result).toEqual(mockZone);
    });
  });

  describe('remove', () => {
    it('should delete a zone', async () => {
      const existingZone = {
        id: 'zone-1',
        name: 'Test Zone',
        color: '#FF5733',
        address: 'Test Address',
        coordinates: { lat: 10.762622, lng: 106.660172 },
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: {
          landPlots: 0,
        },
      };

      const mockZone = {
        id: 'zone-1',
        name: 'Test Zone',
        color: '#FF5733',
        address: 'Test Address',
        coordinates: { lat: 10.762622, lng: 106.660172 },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.zone, 'findUnique').mockResolvedValue(existingZone);
      jest.spyOn(prisma.zone, 'delete').mockResolvedValue(mockZone);

      const result = await service.remove('zone-1');

      expect(prisma.zone.delete).toHaveBeenCalledWith({
        where: { id: 'zone-1' },
      });
      expect(result).toEqual(mockZone);
    });
  });

  describe('getLandPlots', () => {
    it('should return land plots in zone', async () => {
      const mockZone = {
        id: 'zone-1',
        name: 'Zone A',
        color: '#FF0000',
        address: 'Address A',
        coordinates: { lat: 10, lng: 20 },
        createdAt: new Date(),
        updatedAt: new Date(),
        landPlots: [
          { id: 'plot-1', name: 'Plot 1' },
          { id: 'plot-2', name: 'Plot 2' },
        ]
      };
      jest.spyOn(prisma.zone, 'findUnique').mockResolvedValue(mockZone);
      const result = await service.getLandPlots('zone-1');
      expect(result).toEqual(mockZone.landPlots);
    });
  });
}); 