import { ApiResponse, PaginatedResponse, ErrorResponse } from './api-response.interface';

describe('API Response Interfaces', () => {
  describe('ApiResponse', () => {
    it('should create successful response with data', () => {
      const response: ApiResponse<{ id: string; name: string }> = {
        success: true,
        message: 'Data retrieved successfully',
        data: { id: '1', name: 'Test Item' },
        timestamp: '2024-01-01T00:00:00Z',
        path: '/api/test'
      };

      expect(response.success).toBe(true);
      expect(response.message).toBe('Data retrieved successfully');
      expect(response.data).toEqual({ id: '1', name: 'Test Item' });
      expect(response.timestamp).toBe('2024-01-01T00:00:00Z');
      expect(response.path).toBe('/api/test');
    });

    it('should create successful response without data', () => {
      const response: ApiResponse = {
        success: true,
        message: 'Operation completed successfully',
        timestamp: '2024-01-01T00:00:00Z'
      };

      expect(response.success).toBe(true);
      expect(response.message).toBe('Operation completed successfully');
      expect(response.data).toBeUndefined();
      expect(response.error).toBeUndefined();
    });

    it('should create error response', () => {
      const response: ApiResponse = {
        success: false,
        message: 'An error occurred',
        error: 'Validation failed',
        timestamp: '2024-01-01T00:00:00Z',
        path: '/api/test'
      };

      expect(response.success).toBe(false);
      expect(response.message).toBe('An error occurred');
      expect(response.error).toBe('Validation failed');
      expect(response.data).toBeUndefined();
    });

    it('should work with different data types', () => {
      const stringResponse: ApiResponse<string> = {
        success: true,
        message: 'String data',
        data: 'test string',
        timestamp: '2024-01-01T00:00:00Z'
      };

      const numberResponse: ApiResponse<number> = {
        success: true,
        message: 'Number data',
        data: 42,
        timestamp: '2024-01-01T00:00:00Z'
      };

      const arrayResponse: ApiResponse<string[]> = {
        success: true,
        message: 'Array data',
        data: ['item1', 'item2', 'item3'],
        timestamp: '2024-01-01T00:00:00Z'
      };

      expect(stringResponse.data).toBe('test string');
      expect(numberResponse.data).toBe(42);
      expect(arrayResponse.data).toEqual(['item1', 'item2', 'item3']);
    });
  });

  describe('PaginatedResponse', () => {
    it('should create paginated response', () => {
      const response: PaginatedResponse<{ id: string; name: string }> = {
        success: true,
        message: 'Data retrieved successfully',
        data: [
          { id: '1', name: 'Item 1' },
          { id: '2', name: 'Item 2' }
        ],
        timestamp: '2024-01-01T00:00:00Z',
        path: '/api/items',
        pagination: {
          page: 1,
          limit: 10,
          total: 25,
          totalPages: 3
        }
      };

      expect(response.success).toBe(true);
      expect(response.data).toHaveLength(2);
      expect(response.pagination.page).toBe(1);
      expect(response.pagination.limit).toBe(10);
      expect(response.pagination.total).toBe(25);
      expect(response.pagination.totalPages).toBe(3);
    });

    it('should handle empty paginated response', () => {
      const response: PaginatedResponse<{ id: string; name: string }> = {
        success: true,
        message: 'No data found',
        data: [],
        timestamp: '2024-01-01T00:00:00Z',
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        }
      };

      expect(response.data).toHaveLength(0);
      expect(response.pagination.total).toBe(0);
      expect(response.pagination.totalPages).toBe(0);
    });
  });

  describe('ErrorResponse', () => {
    it('should create error response with all required fields', () => {
      const response: ErrorResponse = {
        success: false,
        message: 'Resource not found',
        error: 'The requested resource does not exist',
        timestamp: '2024-01-01T00:00:00Z',
        path: '/api/items/999',
        statusCode: 404
      };

      expect(response.success).toBe(false);
      expect(response.message).toBe('Resource not found');
      expect(response.error).toBe('The requested resource does not exist');
      expect(response.timestamp).toBe('2024-01-01T00:00:00Z');
      expect(response.path).toBe('/api/items/999');
      expect(response.statusCode).toBe(404);
    });

    it('should handle different error types', () => {
      const validationError: ErrorResponse = {
        success: false,
        message: 'Validation failed',
        error: 'Invalid input data',
        timestamp: '2024-01-01T00:00:00Z',
        path: '/api/items',
        statusCode: 400
      };

      const serverError: ErrorResponse = {
        success: false,
        message: 'Internal server error',
        error: 'Database connection failed',
        timestamp: '2024-01-01T00:00:00Z',
        path: '/api/items',
        statusCode: 500
      };

      expect(validationError.statusCode).toBe(400);
      expect(serverError.statusCode).toBe(500);
    });
  });
}); 