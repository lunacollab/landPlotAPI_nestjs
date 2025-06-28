import { HttpStatus } from '@nestjs/common';
import {
  ResourceNotFoundException,
  ConflictException,
  ValidationException,
  UnauthorizedException,
  ForbiddenException,
} from './custom.exception';

describe('Custom Exceptions', () => {
  describe('ResourceNotFoundException', () => {
    it('should create ResourceNotFoundException with resource name', () => {
      const exception = new ResourceNotFoundException('User', 'user-1');
      expect(exception.message).toBe('User with id user-1 not found');
      expect(exception.getStatus()).toBe(404);
    });

    it('should create ResourceNotFoundException without id', () => {
      const exception = new ResourceNotFoundException('User');
      expect(exception.message).toBe('User not found');
      expect(exception.getStatus()).toBe(404);
    });
  });

  describe('ConflictException', () => {
    it('should create ConflictException with message', () => {
      const exception = new ConflictException('User already exists');
      expect(exception.message).toBe('User already exists');
      expect(exception.getStatus()).toBe(409);
    });
  });

  describe('ValidationException', () => {
    it('should create ValidationException with message', () => {
      const exception = new ValidationException('Invalid input data');
      expect(exception.message).toBe('Invalid input data');
      expect(exception.getStatus()).toBe(400);
    });
  });

  describe('UnauthorizedException', () => {
    it('should create UnauthorizedException with default message', () => {
      const exception = new UnauthorizedException();
      expect(exception.message).toBe('Unauthorized');
      expect(exception.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should create UnauthorizedException with custom message', () => {
      const exception = new UnauthorizedException('Invalid credentials');
      expect(exception.message).toBe('Invalid credentials');
      expect(exception.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('ForbiddenException', () => {
    it('should create ForbiddenException with default message', () => {
      const exception = new ForbiddenException();
      expect(exception.message).toBe('Forbidden');
      expect(exception.getStatus()).toBe(HttpStatus.FORBIDDEN);
    });

    it('should create ForbiddenException with custom message', () => {
      const exception = new ForbiddenException('Insufficient permissions');
      expect(exception.message).toBe('Insufficient permissions');
      expect(exception.getStatus()).toBe(HttpStatus.FORBIDDEN);
    });
  });
}); 