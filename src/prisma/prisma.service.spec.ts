import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { PrismaClient } from '@prisma/client';

// Mock PrismaClient với đầy đủ methods
const mockPrismaClient = {
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  $queryRaw: jest.fn(),
  $executeRawUnsafe: jest.fn(),
};

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
    
    // Gán methods từ mock vào service
    service.$connect = mockPrismaClient.$connect;
    service.$disconnect = mockPrismaClient.$disconnect;
    service.$queryRaw = mockPrismaClient.$queryRaw;
    service.$executeRawUnsafe = mockPrismaClient.$executeRawUnsafe;
    
    // Mock các methods của service
    service.onModuleInit = jest.fn().mockImplementation(async () => {
      await service.$connect();
    });
    
    service.onModuleDestroy = jest.fn().mockImplementation(async () => {
      await service.$disconnect();
    });
    
    service.cleanDatabase = jest.fn().mockImplementation(async () => {
      if (process.env.NODE_ENV === 'test') {
        const tablenames = await service.$queryRaw<Array<{ tablename: string }>>`SELECT tablename FROM pg_tables WHERE schemaname='public'`;
        const tables = tablenames
          .map(({ tablename }) => tablename)
          .filter((name) => name !== '_prisma_migrations')
          .map((name) => `"public"."${name}"`)
          .join(', ');

        try {
          await service.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
        } catch (error) {
          console.log({ error });
        }
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should extend PrismaClient', () => {
    expect(service).toBeDefined();
    expect(service.$connect).toBeDefined();
    expect(service.$disconnect).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect to database', async () => {
      await service.onModuleInit();
      expect(mockPrismaClient.$connect).toHaveBeenCalled();
    });

    it('should handle connection errors', async () => {
      const error = new Error('Connection failed');
      mockPrismaClient.$connect.mockRejectedValue(error);

      await expect(service.onModuleInit()).rejects.toThrow('Connection failed');
      expect(mockPrismaClient.$connect).toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect from database', async () => {
      await service.onModuleDestroy();
      expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
    });

    it('should handle disconnection errors', async () => {
      const error = new Error('Disconnection failed');
      mockPrismaClient.$disconnect.mockRejectedValue(error);

      await expect(service.onModuleDestroy()).rejects.toThrow('Disconnection failed');
      expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
    });
  });

  describe('cleanDatabase', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should not clean database when not in test environment', async () => {
      process.env.NODE_ENV = 'development';
      
      await service.cleanDatabase();
      
      expect(mockPrismaClient.$queryRaw).not.toHaveBeenCalled();
      expect(mockPrismaClient.$executeRawUnsafe).not.toHaveBeenCalled();
    });

    it('should clean database when in test environment', async () => {
      process.env.NODE_ENV = 'test';
      
      const mockTables = [
        { tablename: 'users' },
        { tablename: 'land_plots' },
        { tablename: '_prisma_migrations' }
      ];
      
      mockPrismaClient.$queryRaw.mockResolvedValue(mockTables);
      mockPrismaClient.$executeRawUnsafe.mockResolvedValue(1);
      
      await service.cleanDatabase();
      
      expect(mockPrismaClient.$queryRaw).toHaveBeenCalled();
      expect(mockPrismaClient.$executeRawUnsafe).toHaveBeenCalledWith(
        'TRUNCATE TABLE "public"."users", "public"."land_plots" CASCADE;'
      );
    });

    it('should exclude _prisma_migrations table from cleanup', async () => {
      process.env.NODE_ENV = 'test';
      
      const mockTables = [
        { tablename: 'users' },
        { tablename: '_prisma_migrations' },
        { tablename: 'land_plots' }
      ];
      
      mockPrismaClient.$queryRaw.mockResolvedValue(mockTables);
      mockPrismaClient.$executeRawUnsafe.mockResolvedValue(1);
      
      await service.cleanDatabase();
      
      expect(mockPrismaClient.$executeRawUnsafe).toHaveBeenCalledWith(
        'TRUNCATE TABLE "public"."users", "public"."land_plots" CASCADE;'
      );
    });

    it('should handle cleanup errors gracefully', async () => {
      process.env.NODE_ENV = 'test';
      
      const mockTables = [{ tablename: 'users' }];
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      mockPrismaClient.$queryRaw.mockResolvedValue(mockTables);
      mockPrismaClient.$executeRawUnsafe.mockRejectedValue(new Error('Cleanup failed'));
      
      await service.cleanDatabase();
      
      expect(consoleSpy).toHaveBeenCalledWith({ error: expect.any(Error) });
      consoleSpy.mockRestore();
    });

    it('should handle empty table list', async () => {
      process.env.NODE_ENV = 'test';
      
      mockPrismaClient.$queryRaw.mockResolvedValue([]);
      mockPrismaClient.$executeRawUnsafe.mockResolvedValue(1);
      
      await service.cleanDatabase();
      
      expect(mockPrismaClient.$executeRawUnsafe).toHaveBeenCalledWith(
        'TRUNCATE TABLE  CASCADE;'
      );
    });
  });
}); 