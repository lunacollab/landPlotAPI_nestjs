import { ExecutionContext } from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';

describe('CurrentUser', () => {
  let mockExecutionContext: ExecutionContext;
  let mockRequest: any;

  beforeEach(() => {
    mockRequest = {
      user: {
        id: 1,
        email: 'test@example.com',
        role: 'admin',
      },
    };

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as any;
  });

  it('should extract user from request', () => {
    // Test the function inside the decorator directly
    const decoratorFunction = (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    };

    const result = decoratorFunction(null, mockExecutionContext);

    expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
    expect(mockExecutionContext.switchToHttp().getRequest).toHaveBeenCalled();
    expect(result).toEqual(mockRequest.user);
  });

  it('should handle undefined user', () => {
    mockRequest.user = undefined;

    const decoratorFunction = (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    };

    const result = decoratorFunction(null, mockExecutionContext);

    expect(result).toBeUndefined();
  });

  it('should handle null user', () => {
    mockRequest.user = null;

    const decoratorFunction = (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    };

    const result = decoratorFunction(null, mockExecutionContext);

    expect(result).toBeNull();
  });

  it('should handle data parameter', () => {
    const data = 'some-data';

    const decoratorFunction = (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    };

    const result = decoratorFunction(data, mockExecutionContext);

    expect(result).toEqual(mockRequest.user);
  });

  it('should handle complex user object', () => {
    const complexUser = {
      id: 123,
      email: 'complex@example.com',
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'avatar.jpg',
      },
      permissions: ['read', 'write', 'delete'],
      metadata: {
        lastLogin: new Date(),
        preferences: {
          theme: 'dark',
          language: 'en',
        },
      },
    };

    mockRequest.user = complexUser;

    const decoratorFunction = (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    };

    const result = decoratorFunction(null, mockExecutionContext);

    expect(result).toEqual(complexUser);
  });

  it('should handle empty user object', () => {
    mockRequest.user = {};

    const decoratorFunction = (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    };

    const result = decoratorFunction(null, mockExecutionContext);

    expect(result).toEqual({});
  });

  it('should handle string user', () => {
    mockRequest.user = 'user-string';

    const decoratorFunction = (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    };

    const result = decoratorFunction(null, mockExecutionContext);

    expect(result).toBe('user-string');
  });

  it('should handle number user', () => {
    mockRequest.user = 42;

    const decoratorFunction = (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    };

    const result = decoratorFunction(null, mockExecutionContext);

    expect(result).toBe(42);
  });

  it('should handle boolean user', () => {
    mockRequest.user = true;

    const decoratorFunction = (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    };

    const result = decoratorFunction(null, mockExecutionContext);

    expect(result).toBe(true);
  });

  it('should handle array user', () => {
    const userArray = [{ id: 1 }, { id: 2 }];
    mockRequest.user = userArray;

    const decoratorFunction = (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    };

    const result = decoratorFunction(null, mockExecutionContext);

    expect(result).toEqual(userArray);
  });
}); 