import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { CustomException } from '../exceptions/custom.exception';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = {
      method: 'GET',
      url: '/test',
    };

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should handle CustomException', () => {
      const customException = new CustomException('Test error', 400, 'TEST_ERROR');
      
      filter.catch(customException, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Test error',
        error: 'TEST_ERROR',
        timestamp: expect.any(String),
        path: '/test',
        statusCode: 400,
      });
    });

    it('should handle HttpException with message', () => {
      const httpException = new HttpException('Test error', 400);
      
      filter.catch(httpException, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Test error',
        error: 'HTTP_EXCEPTION',
        timestamp: expect.any(String),
        path: '/test',
        statusCode: 400,
      });
    });

    it('should handle HttpException with response object', () => {
      const httpException = new HttpException(
        { message: 'Response message', error: 'RESPONSE_ERROR' },
        400
      );
      
      filter.catch(httpException, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Response message',
        error: 'RESPONSE_ERROR',
        timestamp: expect.any(String),
        path: '/test',
        statusCode: 400,
      });
    });

    it('should handle HttpException without message in response', () => {
      const httpException = new HttpException('Http Exception', 400);
      
      filter.catch(httpException, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Http Exception',
        error: 'HTTP_EXCEPTION',
        timestamp: expect.any(String),
        path: '/test',
        statusCode: 400,
      });
    });

    it('should handle HttpException without error in response', () => {
      const httpException = new HttpException('Test error', 400);
      
      filter.catch(httpException, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Test error',
        error: 'HTTP_EXCEPTION',
        timestamp: expect.any(String),
        path: '/test',
        statusCode: 400,
      });
    });

    it('should handle generic Error', () => {
      const error = new Error('Generic error');
      
      filter.catch(error, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Generic error',
        error: 'UNKNOWN_ERROR',
        timestamp: expect.any(String),
        path: '/test',
        statusCode: 500,
      });
    });

    it('should handle unknown exception type', () => {
      const unknownException = 'String exception';
      
      filter.catch(unknownException, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error',
        error: 'INTERNAL_SERVER_ERROR',
        timestamp: expect.any(String),
        path: '/test',
        statusCode: 500,
      });
    });

    it('should handle null exception', () => {
      filter.catch(null, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error',
        error: 'INTERNAL_SERVER_ERROR',
        timestamp: expect.any(String),
        path: '/test',
        statusCode: 500,
      });
    });

    it('should handle undefined exception', () => {
      filter.catch(undefined, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error',
        error: 'INTERNAL_SERVER_ERROR',
        timestamp: expect.any(String),
        path: '/test',
        statusCode: 500,
      });
    });

    it('should handle CustomException with default values', () => {
      const customException = new CustomException('Test error');
      
      filter.catch(customException, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Test error',
        error: 'CUSTOM_ERROR',
        timestamp: expect.any(String),
        path: '/test',
        statusCode: 400,
      });
    });

    it('should handle different HTTP methods', () => {
      mockRequest.method = 'POST';
      mockRequest.url = '/api/users';
      
      const error = new Error('Test error');
      filter.catch(error, mockHost);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Test error',
        error: 'UNKNOWN_ERROR',
        timestamp: expect.any(String),
        path: '/api/users',
        statusCode: 500,
      });
    });

    it('should handle different status codes', () => {
      const httpException = new HttpException('Not Found', 404);
      
      filter.catch(httpException, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not Found',
        error: 'HTTP_EXCEPTION',
        timestamp: expect.any(String),
        path: '/test',
        statusCode: 404,
      });
    });

    it('should handle 500 status code', () => {
      const httpException = new HttpException('Server Error', 500);
      
      filter.catch(httpException, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Server Error',
        error: 'HTTP_EXCEPTION',
        timestamp: expect.any(String),
        path: '/test',
        statusCode: 500,
      });
    });

    it('should handle 403 status code', () => {
      const httpException = new HttpException('Forbidden', 403);
      
      filter.catch(httpException, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Forbidden',
        error: 'HTTP_EXCEPTION',
        timestamp: expect.any(String),
        path: '/test',
        statusCode: 403,
      });
    });

    it('should handle 401 status code', () => {
      const httpException = new HttpException('Unauthorized', 401);
      
      filter.catch(httpException, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized',
        error: 'HTTP_EXCEPTION',
        timestamp: expect.any(String),
        path: '/test',
        statusCode: 401,
      });
    });

    it('should handle 422 status code', () => {
      const httpException = new HttpException('Validation failed', 422);
      
      filter.catch(httpException, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(422);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        error: 'HTTP_EXCEPTION',
        timestamp: expect.any(String),
        path: '/test',
        statusCode: 422,
      });
    });
  });
}); 