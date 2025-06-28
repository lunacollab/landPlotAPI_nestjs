import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let mockReflector: jest.Mocked<Reflector>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    mockReflector = module.get(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let context: ExecutionContext;

    beforeEach(() => {
      context = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: {
              id: 'user-1',
              role: Role.WORKER,
            },
          }),
        }),
        getHandler: () => ({}),
        getClass: () => ({}),
      } as ExecutionContext;
    });

    it('should return true when no roles are required', () => {
      mockReflector.getAllAndOverride.mockReturnValue(undefined);

      const result = guard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should return true when user has required role', () => {
      mockReflector.getAllAndOverride.mockReturnValue([Role.WORKER]);

      const result = guard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should return true when user has one of the required roles', () => {
      mockReflector.getAllAndOverride.mockReturnValue([Role.FARM_OWNER, Role.WORKER]);

      const result = guard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user does not have required role', () => {
      mockReflector.getAllAndOverride.mockReturnValue([Role.FARM_OWNER]);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when user is not authenticated', () => {
      context = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: null,
          }),
        }),
        getHandler: () => ({}),
        getClass: () => ({}),
      } as ExecutionContext;

      mockReflector.getAllAndOverride.mockReturnValue([Role.FARM_OWNER]);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });
  });
}); 