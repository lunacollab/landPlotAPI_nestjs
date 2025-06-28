import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../../../prisma/prisma.service';

// Mock PassportStrategy
jest.mock('@nestjs/passport', () => ({
  PassportStrategy: jest.fn().mockImplementation((strategy) => {
    return function MockPassportStrategy() {
      this.strategy = strategy;
    };
  }),
}));

// Mock passport-jwt
jest.mock('passport-jwt', () => ({
  ExtractJwt: {
    fromAuthHeaderAsBearerToken: jest.fn().mockReturnValue(() => 'mock-token'),
  },
  Strategy: jest.fn().mockImplementation(() => ({
    authenticate: jest.fn(),
  })),
}));

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;
  let prismaService: PrismaService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(strategy).toBeDefined();
    });

    it('should use default secret when config is not available', () => {
      mockConfigService.get.mockReturnValue(undefined);
      
      const newStrategy = new JwtStrategy(configService, prismaService);
      expect(newStrategy).toBeDefined();
    });
  });

  describe('validate', () => {
    it('should return user data when user exists', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const payload = { sub: 1, email: 'test@example.com' };
      const result = await strategy.validate(payload);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const payload = { sub: 1, email: 'test@example.com' };

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection failed');
      mockPrismaService.user.findUnique.mockRejectedValue(dbError);

      const payload = { sub: 1, email: 'test@example.com' };

      await expect(strategy.validate(payload)).rejects.toThrow(dbError);
    });

    it('should handle payload with different user ID', async () => {
      const mockUser = {
        id: 2,
        email: 'test2@example.com',
        name: 'Test User 2',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const payload = { sub: 2, email: 'test2@example.com' };
      const result = await strategy.validate(payload);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 2 },
      });
    });

    it('should handle user with null values', async () => {
      const mockUser = {
        id: 1,
        email: null,
        name: null,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const payload = { sub: 1, email: null };
      const result = await strategy.validate(payload);

      expect(result).toEqual(mockUser);
    });

    it('should handle user with undefined values', async () => {
      const mockUser = {
        id: 1,
        email: undefined,
        name: undefined,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const payload = { sub: 1, email: undefined };
      const result = await strategy.validate(payload);

      expect(result).toEqual(mockUser);
    });

    it('should handle payload without email', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const payload = { sub: 1 };
      const result = await strategy.validate(payload);

      expect(result).toEqual(mockUser);
    });

    it('should handle payload with additional properties', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const payload = { 
        sub: 1, 
        email: 'test@example.com',
        iat: 1234567890,
        exp: 1234567890,
        extra: 'additional data'
      };
      const result = await strategy.validate(payload);

      expect(result).toEqual(mockUser);
    });
  });
}); 