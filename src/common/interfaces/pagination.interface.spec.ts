import { PaginationDto, PaginationMeta, PaginatedResult } from './pagination.interface';

describe('Pagination Interfaces', () => {
  describe('PaginationDto', () => {
    it('should allow optional properties', () => {
      const paginationDto: PaginationDto = {};
      expect(paginationDto).toBeDefined();
    });

    it('should accept all properties', () => {
      const paginationDto: PaginationDto = {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };
      
      expect(paginationDto.page).toBe(1);
      expect(paginationDto.limit).toBe(10);
      expect(paginationDto.sortBy).toBe('createdAt');
      expect(paginationDto.sortOrder).toBe('desc');
    });

    it('should accept valid sortOrder values', () => {
      const paginationDto1: PaginationDto = { sortOrder: 'asc' };
      const paginationDto2: PaginationDto = { sortOrder: 'desc' };
      
      expect(paginationDto1.sortOrder).toBe('asc');
      expect(paginationDto2.sortOrder).toBe('desc');
    });
  });

  describe('PaginationMeta', () => {
    it('should have all required properties', () => {
      const meta: PaginationMeta = {
        page: 1,
        limit: 10,
        total: 100,
        totalPages: 10,
        hasNext: true,
        hasPrev: false
      };
      
      expect(meta.page).toBe(1);
      expect(meta.limit).toBe(10);
      expect(meta.total).toBe(100);
      expect(meta.totalPages).toBe(10);
      expect(meta.hasNext).toBe(true);
      expect(meta.hasPrev).toBe(false);
    });

    it('should handle edge cases', () => {
      const meta: PaginationMeta = {
        page: 1,
        limit: 1,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      };
      
      expect(meta.total).toBe(0);
      expect(meta.totalPages).toBe(0);
      expect(meta.hasNext).toBe(false);
      expect(meta.hasPrev).toBe(false);
    });
  });

  describe('PaginatedResult', () => {
    it('should work with any data type', () => {
      interface TestData {
        id: string;
        name: string;
      }

      const result: PaginatedResult<TestData> = {
        data: [
          { id: '1', name: 'Test 1' },
          { id: '2', name: 'Test 2' }
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      };
      
      expect(result.data).toHaveLength(2);
      expect(result.data[0].id).toBe('1');
      expect(result.data[1].name).toBe('Test 2');
      expect(result.meta.total).toBe(2);
    });

    it('should handle empty data', () => {
      const result: PaginatedResult<string> = {
        data: [],
        meta: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      };
      
      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });

    it('should work with complex data types', () => {
      interface ComplexData {
        id: string;
        metadata: {
          createdAt: Date;
          tags: string[];
        };
      }

      const result: PaginatedResult<ComplexData> = {
        data: [
          {
            id: '1',
            metadata: {
              createdAt: new Date(),
              tags: ['tag1', 'tag2']
            }
          }
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      };
      
      expect(result.data[0].metadata.tags).toContain('tag1');
      expect(result.data[0].metadata.tags).toContain('tag2');
    });
  });
}); 