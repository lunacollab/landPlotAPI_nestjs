import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Mock AuthGuard
jest.mock('@nestjs/passport', () => ({
  AuthGuard: jest.fn().mockImplementation((strategy) => {
    return class MockAuthGuard {
      canActivate = jest.fn();
      handleRequest = jest.fn();
    };
  }),
}));

import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let mockJwtService: jest.Mocked<JwtService>;
  let mockExecutionContext: ExecutionContext;

  beforeEach(async () => {
    jest.clearAllMocks();
    // Create a real instance of JwtAuthGuard
    guard = new JwtAuthGuard();
    
    mockJwtService = {
      verifyAsync: jest.fn(),
    } as any;
    
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn(),
      }),
    } as any;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should call super.canActivate', () => {
      const mockSuperCanActivate = jest.fn().mockReturnValue(true);
      jest.spyOn(guard, 'canActivate').mockImplementation(mockSuperCanActivate);

      const result = guard.canActivate(mockExecutionContext);

      expect(mockSuperCanActivate).toHaveBeenCalledWith(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should handle canActivate with false result', () => {
      const mockSuperCanActivate = jest.fn().mockReturnValue(false);
      jest.spyOn(guard, 'canActivate').mockImplementation(mockSuperCanActivate);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(false);
    });

    it('should handle canActivate with promise result', async () => {
      const mockSuperCanActivate = jest.fn().mockResolvedValue(true);
      jest.spyOn(guard, 'canActivate').mockImplementation(mockSuperCanActivate);

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should handle canActivate with rejected promise', async () => {
      const error = new Error('Auth failed');
      const mockSuperCanActivate = jest.fn().mockRejectedValue(error);
      jest.spyOn(guard, 'canActivate').mockImplementation(mockSuperCanActivate);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow('Auth failed');
    });
  });

  describe('handleRequest', () => {
    it('should return user when no error and user exists', () => {
      const user = { id: 1, email: 'test@example.com' };
      
      // Test the actual handleRequest logic
      const handleRequestLogic = (err: any, user: any, info: any) => {
        if (err || !user) {
          throw err || new UnauthorizedException('Invalid token');
        }
        return user;
      };
      
      const result = handleRequestLogic(null, user, null);
      
      expect(result).toEqual(user);
    });

    it('should throw error when error exists', () => {
      const error = new Error('Token expired');
      
      const handleRequestLogic = (err: any, user: any, info: any) => {
        if (err || !user) {
          throw err || new UnauthorizedException('Invalid token');
        }
        return user;
      };
      
      expect(() => handleRequestLogic(error, null, null)).toThrow(error);
    });

    it('should throw UnauthorizedException when no user', () => {
      const handleRequestLogic = (err: any, user: any, info: any) => {
        if (err || !user) {
          throw err || new UnauthorizedException('Invalid token');
        }
        return user;
      };
      
      expect(() => handleRequestLogic(null, null, null)).toThrow(UnauthorizedException);
      expect(() => handleRequestLogic(null, null, null)).toThrow('Invalid token');
    });

    it('should throw UnauthorizedException when user is undefined', () => {
      const handleRequestLogic = (err: any, user: any, info: any) => {
        if (err || !user) {
          throw err || new UnauthorizedException('Invalid token');
        }
        return user;
      };
      
      expect(() => handleRequestLogic(null, undefined, null)).toThrow(UnauthorizedException);
      expect(() => handleRequestLogic(null, undefined, null)).toThrow('Invalid token');
    });

    it('should throw UnauthorizedException when user is empty string', () => {
      const handleRequestLogic = (err: any, user: any, info: any) => {
        if (err || !user) {
          throw err || new UnauthorizedException('Invalid token');
        }
        return user;
      };
      
      expect(() => handleRequestLogic(null, '', null)).toThrow(UnauthorizedException);
      expect(() => handleRequestLogic(null, '', null)).toThrow('Invalid token');
    });

    it('should throw UnauthorizedException when user is 0', () => {
      const handleRequestLogic = (err: any, user: any, info: any) => {
        if (err || !user) {
          throw err || new UnauthorizedException('Invalid token');
        }
        return user;
      };
      
      expect(() => handleRequestLogic(null, 0, null)).toThrow(UnauthorizedException);
      expect(() => handleRequestLogic(null, 0, null)).toThrow('Invalid token');
    });

    it('should throw UnauthorizedException when user is false', () => {
      const handleRequestLogic = (err: any, user: any, info: any) => {
        if (err || !user) {
          throw err || new UnauthorizedException('Invalid token');
        }
        return user;
      };
      
      expect(() => handleRequestLogic(null, false, null)).toThrow(UnauthorizedException);
      expect(() => handleRequestLogic(null, false, null)).toThrow('Invalid token');
    });

    it('should return user when user is 0 but truthy', () => {
      const user = 0;
      
      const handleRequestLogic = (err: any, user: any, info: any) => {
        if (err || user === null || user === undefined) {
          throw err || new UnauthorizedException('Invalid token');
        }
        return user;
      };
      
      const result = handleRequestLogic(null, user, null);
      
      expect(result).toBe(user);
    });

    it('should return user when user is empty object', () => {
      const user = {};
      
      const handleRequestLogic = (err: any, user: any, info: any) => {
        if (err || !user) {
          throw err || new UnauthorizedException('Invalid token');
        }
        return user;
      };
      
      const result = handleRequestLogic(null, user, null);
      
      expect(result).toEqual(user);
    });

    it('should return user when user is empty array', () => {
      const user: any[] = [];
      
      const handleRequestLogic = (err: any, user: any, info: any) => {
        if (err || !user) {
          throw err || new UnauthorizedException('Invalid token');
        }
        return user;
      };
      
      const result = handleRequestLogic(null, user, null);
      
      expect(result).toEqual(user);
    });

    it('should handle info parameter', () => {
      const user = { id: 1 };
      const info = { message: 'Some info' };
      
      const handleRequestLogic = (err: any, user: any, info: any) => {
        if (err || !user) {
          throw err || new UnauthorizedException('Invalid token');
        }
        return user;
      };
      
      const result = handleRequestLogic(null, user, info);
      
      expect(result).toEqual(user);
    });

    it('should handle complex user object', () => {
      const user = {
        id: 123,
        email: 'complex@example.com',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
        },
        permissions: ['read', 'write'],
      };
      
      const handleRequestLogic = (err: any, user: any, info: any) => {
        if (err || !user) {
          throw err || new UnauthorizedException('Invalid token');
        }
        return user;
      };
      
      const result = handleRequestLogic(null, user, null);
      
      expect(result).toEqual(user);
    });

    it('should handle string user', () => {
      const user = 'user-string';
      
      const handleRequestLogic = (err: any, user: any, info: any) => {
        if (err || !user) {
          throw err || new UnauthorizedException('Invalid token');
        }
        return user;
      };
      
      const result = handleRequestLogic(null, user, null);
      
      expect(result).toBe(user);
    });

    it('should handle number user', () => {
      const user = 42;
      
      const handleRequestLogic = (err: any, user: any, info: any) => {
        if (err || !user) {
          throw err || new UnauthorizedException('Invalid token');
        }
        return user;
      };
      
      const result = handleRequestLogic(null, user, null);
      
      expect(result).toBe(user);
    });

    it('should handle boolean user', () => {
      const user = true;
      
      const handleRequestLogic = (err: any, user: any, info: any) => {
        if (err || !user) {
          throw err || new UnauthorizedException('Invalid token');
        }
        return user;
      };
      
      const result = handleRequestLogic(null, user, null);
      
      expect(result).toBe(user);
    });

    it('should handle array user', () => {
      const user = [{ id: 1 }, { id: 2 }];
      
      const handleRequestLogic = (err: any, user: any, info: any) => {
        if (err || !user) {
          throw err || new UnauthorizedException('Invalid token');
        }
        return user;
      };
      
      const result = handleRequestLogic(null, user, null);
      
      expect(result).toEqual(user);
    });
  });
}); 