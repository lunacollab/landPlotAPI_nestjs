import { HttpStatus } from '@nestjs/common';
import {
  CustomException,
  ResourceNotFoundException,
  ValidationException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
} from './custom.exception';

describe('CustomException', () => {
  describe('CustomException', () => {
    it('should create custom exception with default values', () => {
      const exception = new CustomException('Test message');

      expect(exception.message).toBe('Test message');
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(exception.errorCode).toBeUndefined();
      expect(exception.getResponse()).toEqual({
        success: false,
        message: 'Test message',
        error: 'CUSTOM_ERROR',
        timestamp: expect.any(String),
        statusCode: HttpStatus.BAD_REQUEST,
      });
    });

    it('should create custom exception with custom status', () => {
      const exception = new CustomException('Test message', HttpStatus.NOT_FOUND);

      expect(exception.message).toBe('Test message');
      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(exception.getResponse()).toEqual({
        success: false,
        message: 'Test message',
        error: 'CUSTOM_ERROR',
        timestamp: expect.any(String),
        statusCode: HttpStatus.NOT_FOUND,
      });
    });

    it('should create custom exception with custom error code', () => {
      const exception = new CustomException('Test message', HttpStatus.BAD_REQUEST, 'CUSTOM_ERROR_CODE');

      expect(exception.message).toBe('Test message');
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(exception.errorCode).toBe('CUSTOM_ERROR_CODE');
      expect(exception.getResponse()).toEqual({
        success: false,
        message: 'Test message',
        error: 'CUSTOM_ERROR_CODE',
        timestamp: expect.any(String),
        statusCode: HttpStatus.BAD_REQUEST,
      });
    });

    it('should create custom exception with all parameters', () => {
      const exception = new CustomException('Test message', HttpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL_ERROR');

      expect(exception.message).toBe('Test message');
      expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(exception.errorCode).toBe('INTERNAL_ERROR');
      expect(exception.getResponse()).toEqual({
        success: false,
        message: 'Test message',
        error: 'INTERNAL_ERROR',
        timestamp: expect.any(String),
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });

    it('should handle empty message', () => {
      const exception = new CustomException('');

      expect(exception.message).toBe('');
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(exception.getResponse()).toEqual({
        success: false,
        message: '',
        error: 'CUSTOM_ERROR',
        timestamp: expect.any(String),
        statusCode: HttpStatus.BAD_REQUEST,
      });
    });

    it('should handle special characters in message', () => {
      const message = 'Test message with special chars: !@#$%^&*()';
      const exception = new CustomException(message);

      expect(exception.message).toBe(message);
      expect(exception.getResponse()).toEqual({
        success: false,
        message,
        error: 'CUSTOM_ERROR',
        timestamp: expect.any(String),
        statusCode: HttpStatus.BAD_REQUEST,
      });
    });

    it('should handle unicode characters in message', () => {
      const message = 'Test message with unicode: 测试消息 🚀';
      const exception = new CustomException(message);

      expect(exception.message).toBe(message);
      expect(exception.getResponse()).toEqual({
        success: false,
        message,
        error: 'CUSTOM_ERROR',
        timestamp: expect.any(String),
        statusCode: HttpStatus.BAD_REQUEST,
      });
    });
  });

  describe('ResourceNotFoundException', () => {
    it('should create resource not found exception with id', () => {
      const exception = new ResourceNotFoundException('User', '123');

      expect(exception.message).toBe('User with id 123 not found');
      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(exception.errorCode).toBe('RESOURCE_NOT_FOUND');
      expect(exception.getResponse()).toEqual({
        success: false,
        message: 'User with id 123 not found',
        error: 'RESOURCE_NOT_FOUND',
        timestamp: expect.any(String),
        statusCode: HttpStatus.NOT_FOUND,
      });
    });

    it('should create resource not found exception without id', () => {
      const exception = new ResourceNotFoundException('User');

      expect(exception.message).toBe('User not found');
      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(exception.errorCode).toBe('RESOURCE_NOT_FOUND');
    });

    it('should handle empty id', () => {
      const exception = new ResourceNotFoundException('User', '');

      expect(exception.message).toBe('User not found');
      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
    });

    it('should handle undefined id', () => {
      const exception = new ResourceNotFoundException('User', undefined);

      expect(exception.message).toBe('User not found');
      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
    });

    it('should handle complex resource names', () => {
      const exception = new ResourceNotFoundException('UserProfile', '456');

      expect(exception.message).toBe('UserProfile with id 456 not found');
      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
    });

    it('should handle special characters in resource name', () => {
      const exception = new ResourceNotFoundException('User-Profile', '789');

      expect(exception.message).toBe('User-Profile with id 789 not found');
      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('ValidationException', () => {
    it('should create validation exception', () => {
      const exception = new ValidationException('Validation failed');

      expect(exception.message).toBe('Validation failed');
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(exception.errorCode).toBe('VALIDATION_ERROR');
    });

    it('should handle empty message', () => {
      const exception = new ValidationException('');

      expect(exception.message).toBe('');
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(exception.errorCode).toBe('VALIDATION_ERROR');
    });
  });

  describe('UnauthorizedException', () => {
    it('should create unauthorized exception with default message', () => {
      const exception = new UnauthorizedException();

      expect(exception.message).toBe('Unauthorized');
      expect(exception.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
      expect(exception.errorCode).toBe('UNAUTHORIZED');
    });

    it('should create unauthorized exception with custom message', () => {
      const exception = new UnauthorizedException('Custom unauthorized message');

      expect(exception.message).toBe('Custom unauthorized message');
      expect(exception.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
      expect(exception.errorCode).toBe('UNAUTHORIZED');
    });
  });

  describe('ForbiddenException', () => {
    it('should create forbidden exception with default message', () => {
      const exception = new ForbiddenException();

      expect(exception.message).toBe('Forbidden');
      expect(exception.getStatus()).toBe(HttpStatus.FORBIDDEN);
      expect(exception.errorCode).toBe('FORBIDDEN');
    });

    it('should create forbidden exception with custom message', () => {
      const exception = new ForbiddenException('Custom forbidden message');

      expect(exception.message).toBe('Custom forbidden message');
      expect(exception.getStatus()).toBe(HttpStatus.FORBIDDEN);
      expect(exception.errorCode).toBe('FORBIDDEN');
    });
  });

  describe('ConflictException', () => {
    it('should create conflict exception', () => {
      const exception = new ConflictException('Resource already exists');

      expect(exception.message).toBe('Resource already exists');
      expect(exception.getStatus()).toBe(HttpStatus.CONFLICT);
      expect(exception.errorCode).toBe('CONFLICT');
    });

    it('should handle empty message', () => {
      const exception = new ConflictException('');

      expect(exception.message).toBe('');
      expect(exception.getStatus()).toBe(HttpStatus.CONFLICT);
      expect(exception.errorCode).toBe('CONFLICT');
    });
  });
}); 