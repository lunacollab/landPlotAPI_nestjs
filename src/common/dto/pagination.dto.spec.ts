import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { PaginationDto } from './pagination.dto';

describe('PaginationDto', () => {
  it('should create valid pagination dto with default values', async () => {
    const dto = plainToClass(PaginationDto, {});
    
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.page).toBe(1);
    expect(dto.limit).toBe(10);
    expect(dto.sortOrder).toBe('asc');
  });

  it('should create valid pagination dto with custom values', async () => {
    const dto = plainToClass(PaginationDto, {
      page: 2,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.page).toBe(2);
    expect(dto.limit).toBe(20);
    expect(dto.sortBy).toBe('createdAt');
    expect(dto.sortOrder).toBe('desc');
  });

  it('should validate page minimum value', async () => {
    const dto = plainToClass(PaginationDto, { page: 0 });
    
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should validate limit minimum value', async () => {
    const dto = plainToClass(PaginationDto, { limit: 0 });
    
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should validate limit maximum value', async () => {
    const dto = plainToClass(PaginationDto, { limit: 101 });
    
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('max');
  });

  it('should validate sortOrder values', async () => {
    const dto = plainToClass(PaginationDto, { sortOrder: 'invalid' });
    
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isIn');
  });

  it('should accept valid sortOrder values', async () => {
    const dto1 = plainToClass(PaginationDto, { sortOrder: 'asc' });
    const dto2 = plainToClass(PaginationDto, { sortOrder: 'desc' });
    
    const errors1 = await validate(dto1);
    const errors2 = await validate(dto2);
    
    expect(errors1).toHaveLength(0);
    expect(errors2).toHaveLength(0);
  });

  it('should handle string numbers for page and limit', async () => {
    const dto = plainToClass(PaginationDto, {
      page: '5',
      limit: '25'
    });
    
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.page).toBe(5);
    expect(dto.limit).toBe(25);
  });
}); 