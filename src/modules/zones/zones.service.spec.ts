import { Test, TestingModule } from '@nestjs/testing';
import { ZonesService } from './zones.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ResourceNotFoundException, ConflictException } from '../../common/exceptions/custom.exception';
import { CreateZoneDto, UpdateZoneDto } from './dto/zone.dto';
import { Zone } from '@prisma/client';

describe('ZonesService', () => {
  let service: ZonesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    zone: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ZonesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
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
        description: 'Test Description',
        color: '#FF0000',
        coordinates: [{ lat: 10, lng: 20 }],
      };

      const mockZone: Zone = {
        id: 'zone-1',
        name: 'Test Zone',
        description: 'Test Description',
        color: '#FF0000',
        coordinates: [{ lat: 10, lng: 20 }] as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.zone, 'create').mockResolvedValue(mockZone);

      const result = await service.create(createZoneDto);

      expect(prisma.zone.create).toHaveBeenCalledWith({
        data: createZoneDto,
      });
      expect(result).toEqual(mockZone);
    });
  });

  describe('findAll', () => {
    it('should return all zones', async () => {
      const mockZones: Zone[] = [
        {
          id: 'zone-1',
          name: 'Zone 1',
          description: 'Description 1',
          color: '#FF0000',
          coordinates: [{ lat: 10, lng: 20 }] as any,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'zone-2',
          name: 'Zone 2',
          description: 'Description 2',
          color: '#00FF00',
          coordinates: [{ lat: 30, lng: 40 }] as any,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(prisma.zone, 'findMany').mockResolvedValue(mockZones);
      jest.spyOn(prisma.zone, 'count').mockResolvedValue(2);

      const result = await service.findAll({});

      expect(prisma.zone.findMany).toHaveBeenCalled();
      expect(result.data).toEqual(mockZones);
      expect(result.total).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should return a zone by id', async () => {
      const mockZone: Zone = {
        id: 'zone-1',
        name: 'Test Zone',
        description: 'Test Description',
        color: '#FF0000',
        coordinates: [{ lat: 10, lng: 20 }] as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.zone, 'findUnique').mockResolvedValue(mockZone);

      const result = await service.findOne('zone-1');

      expect(prisma.zone.findUnique).toHaveBeenCalledWith({
        where: { id: 'zone-1' },
      });
      expect(result).toEqual(mockZone);
    });
  });

  describe('update', () => {
    it('should update a zone', async () => {
      const updateZoneDto: UpdateZoneDto = {
        name: 'Updated Zone',
        description: 'Updated Description',
      };

      const mockZone: Zone = {
        id: 'zone-1',
        name: 'Updated Zone',
        description: 'Updated Description',
        color: '#FF0000',
        coordinates: [{ lat: 10, lng: 20 }] as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.zone, 'update').mockResolvedValue(mockZone);

      const result = await service.update('zone-1', updateZoneDto);

      expect(prisma.zone.update).toHaveBeenCalledWith({
        where: { id: 'zone-1' },
        data: updateZoneDto,
      });
      expect(result).toEqual(mockZone);
    });
  });

  describe('remove', () => {
    it('should delete a zone', async () => {
      const mockZone: Zone = {
        id: 'zone-1',
        name: 'Test Zone',
        description: 'Test Description',
        color: '#FF0000',
        coordinates: [{ lat: 10, lng: 20 }] as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

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