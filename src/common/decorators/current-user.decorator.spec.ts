import { ExecutionContext } from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';

describe('CurrentUser', () => {
  it('should extract user from request', () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    const mockRequest = { user: mockUser };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    const decoratorFn = CurrentUser(null, mockContext);
    expect(typeof decoratorFn).toBe('function');
    
    const request = mockContext.switchToHttp().getRequest();
    expect(request.user).toEqual(mockUser);
  });

  it('should return undefined when no user in request', () => {
    const mockRequest = {};
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    const decoratorFn = CurrentUser(null, mockContext);
    expect(typeof decoratorFn).toBe('function');
    
    const request = mockContext.switchToHttp().getRequest();
    expect(request.user).toBeUndefined();
  });

  it('should handle null request', () => {
    const mockRequest = null;
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    const decoratorFn = CurrentUser(null, mockContext);
    expect(typeof decoratorFn).toBe('function');
    
    const request = mockContext.switchToHttp().getRequest();
    expect(request).toBeNull();
  });
}); 