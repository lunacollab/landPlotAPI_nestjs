import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let mockJwtService: jest.Mocked<JwtService>;

  const createMockContext = () => ({
    switchToHttp: () => ({
      getRequest: () => ({ headers: { authorization: 'Bearer valid-token' } }),
      getResponse: () => ({})
    }),
    getHandler: () => jest.fn(),
    getClass: () => jest.fn(),
  } as unknown as ExecutionContext);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    mockJwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it.skip('should return true for valid token', async () => {
      // Cần setup passport JWT strategy cho test
    });

    it.skip('should throw UnauthorizedException for missing token', async () => {
      // Cần setup passport JWT strategy cho test
    });

    it.skip('should throw UnauthorizedException for invalid token format', async () => {
      // Cần setup passport JWT strategy cho test
    });

    it.skip('should throw UnauthorizedException for invalid token', async () => {
      // Cần setup passport JWT strategy cho test
    });
  });
}); 