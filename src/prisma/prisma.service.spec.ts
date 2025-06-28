import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have required methods', () => {
    expect(typeof service.$connect).toBe('function');
    expect(typeof service.$disconnect).toBe('function');
    expect(typeof service.$queryRaw).toBe('function');
    expect(typeof service.$executeRawUnsafe).toBe('function');
  });

  it('should have lifecycle methods', () => {
    expect(typeof service.onModuleInit).toBe('function');
    expect(typeof service.onModuleDestroy).toBe('function');
    expect(typeof service.cleanDatabase).toBe('function');
  });

  describe('constructor', () => {
    it('should be instantiable', () => {
      expect(service).toBeInstanceOf(PrismaService);
    });
  });

  describe('onModuleInit', () => {
    it('should be callable', async () => {
      // Mock the $connect method
      jest.spyOn(service, '$connect').mockResolvedValue(undefined);
      
      await expect(service.onModuleInit()).resolves.toBeUndefined();
      expect(service.$connect).toHaveBeenCalled();
    });

    it('should handle $connect error', async () => {
      const error = new Error('Connection failed');
      jest.spyOn(service, '$connect').mockRejectedValue(error);

      await expect(service.onModuleInit()).rejects.toThrow('Connection failed');
    });
  });

  describe('onModuleDestroy', () => {
    it('should be callable', async () => {
      // Mock the $disconnect method
      jest.spyOn(service, '$disconnect').mockResolvedValue(undefined);
      
      await expect(service.onModuleDestroy()).resolves.toBeUndefined();
      expect(service.$disconnect).toHaveBeenCalled();
    });

    it('should handle $disconnect error', async () => {
      const error = new Error('Disconnect failed');
      jest.spyOn(service, '$disconnect').mockRejectedValue(error);

      await expect(service.onModuleDestroy()).rejects.toThrow('Disconnect failed');
    });
  });

  describe('cleanDatabase', () => {
    beforeEach(() => {
      jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should clean database when NODE_ENV is test', async () => {
      process.env.NODE_ENV = 'test';
      
      // Mock the methods
      jest.spyOn(service, '$queryRaw').mockResolvedValue([
        { tablename: 'users' },
        { tablename: 'posts' },
        { tablename: '_prisma_migrations' },
      ] as any);
      jest.spyOn(service, '$executeRawUnsafe').mockResolvedValue(0 as any);

      await service.cleanDatabase();

      expect(service.$queryRaw).toHaveBeenCalled();
      expect(service.$executeRawUnsafe).toHaveBeenCalled();
    });

    it('should not clean database when NODE_ENV is not test', async () => {
      process.env.NODE_ENV = 'development';
      
      jest.spyOn(service, '$queryRaw').mockResolvedValue([] as any);
      jest.spyOn(service, '$executeRawUnsafe').mockResolvedValue(0 as any);

      await service.cleanDatabase();

      expect(service.$queryRaw).not.toHaveBeenCalled();
      expect(service.$executeRawUnsafe).not.toHaveBeenCalled();
    });

    it('should not clean database when NODE_ENV is production', async () => {
      process.env.NODE_ENV = 'production';
      
      jest.spyOn(service, '$queryRaw').mockResolvedValue([] as any);
      jest.spyOn(service, '$executeRawUnsafe').mockResolvedValue(0 as any);

      await service.cleanDatabase();

      expect(service.$queryRaw).not.toHaveBeenCalled();
      expect(service.$executeRawUnsafe).not.toHaveBeenCalled();
    });

    it('should handle $queryRaw error', async () => {
      process.env.NODE_ENV = 'test';
      const error = new Error('Query failed');
      jest.spyOn(service, '$queryRaw').mockRejectedValue(error);

      await expect(service.cleanDatabase()).rejects.toThrow('Query failed');
    });

    it('should handle $executeRawUnsafe error and log it', async () => {
      process.env.NODE_ENV = 'test';
      jest.spyOn(service, '$queryRaw').mockResolvedValue([
        { tablename: 'users' },
      ] as any);
      const error = new Error('Execute failed');
      jest.spyOn(service, '$executeRawUnsafe').mockRejectedValue(error);

      await service.cleanDatabase();

      expect(console.log).toHaveBeenCalledWith({ error });
    });

    it('should handle undefined NODE_ENV', async () => {
      delete process.env.NODE_ENV;
      
      jest.spyOn(service, '$queryRaw').mockResolvedValue([] as any);
      jest.spyOn(service, '$executeRawUnsafe').mockResolvedValue(0 as any);

      await service.cleanDatabase();

      expect(service.$queryRaw).not.toHaveBeenCalled();
      expect(service.$executeRawUnsafe).not.toHaveBeenCalled();
    });
  });
}); 