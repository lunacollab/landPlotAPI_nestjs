import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionFilter],
    }).compile();

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should handle HttpException', () => {
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);
      const mockRequest = {
        url: '/test',
        method: 'GET',
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      filter.catch(exception, { switchToHttp: () => ({ getRequest: () => mockRequest, getResponse: () => mockResponse }) } as any);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Test error',
        error: 'HTTP_EXCEPTION',
        statusCode: HttpStatus.BAD_REQUEST,
        path: '/test',
        timestamp: expect.any(String),
      });
    });

    it('should handle generic Error', () => {
      const exception = new Error('Generic error');
      const mockRequest = { url: '/test' };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      filter.catch(exception, { switchToHttp: () => ({ getRequest: () => mockRequest, getResponse: () => mockResponse }) } as any);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Generic error',
        error: 'UNKNOWN_ERROR',
        statusCode: 500,
        path: '/test',
        timestamp: expect.any(String),
      });
    });

    it('should handle ValidationError', () => {
      const exception = new Error('Validation failed');
      const mockRequest = { url: '/test' };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      filter.catch(exception, { switchToHttp: () => ({ getRequest: () => mockRequest, getResponse: () => mockResponse }) } as any);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        error: 'UNKNOWN_ERROR',
        statusCode: 500,
        path: '/test',
        timestamp: expect.any(String),
      });
    });
  });
}); 