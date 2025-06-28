import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateWorkerDto, UpdateWorkerDto, WorkerFilterDto } from './worker.dto';
import { Role, UserStatus } from '@prisma/client';

describe('Worker DTOs', () => {
  describe('CreateWorkerDto', () => {
    it('should validate valid data', async () => {
      const dto = plainToClass(CreateWorkerDto, {
        email: 'test@example.com',
        name: 'John Doe',
        phone: '+1234567890',
        role: Role.WORKER,
        status: UserStatus.WORKING,
        expertise: { skills: ['planting'], hourlyRate: 15.0 }
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate required fields', async () => {
      const dto = plainToClass(CreateWorkerDto, {
        // Missing email and name
        phone: '+1234567890'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'email')).toBe(true);
      expect(errors.some(e => e.property === 'name')).toBe(true);
    });

    it('should validate email format', async () => {
      const dto = plainToClass(CreateWorkerDto, {
        email: 'invalid-email',
        name: 'John Doe'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should validate enum values', async () => {
      const dto = plainToClass(CreateWorkerDto, {
        email: 'test@example.com',
        name: 'John Doe',
        role: 'INVALID_ROLE',
        status: 'INVALID_STATUS'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'role')).toBe(true);
      expect(errors.some(e => e.property === 'status')).toBe(true);
    });

    it('should validate object expertise', async () => {
      const dto = plainToClass(CreateWorkerDto, {
        email: 'test@example.com',
        name: 'John Doe',
        expertise: 'not-an-object'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('expertise');
    });

    it('should allow optional fields to be undefined', async () => {
      const dto = plainToClass(CreateWorkerDto, {
        email: 'test@example.com',
        name: 'John Doe'
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('UpdateWorkerDto', () => {
    it('should validate valid data', async () => {
      const dto = plainToClass(UpdateWorkerDto, {
        email: 'updated@example.com',
        name: 'Updated Name',
        role: Role.FARM_OWNER,
        status: UserStatus.WORKING
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should allow partial updates', async () => {
      const dto = plainToClass(UpdateWorkerDto, {
        email: 'updated@example.com'
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate email format when provided', async () => {
      const dto = plainToClass(UpdateWorkerDto, {
        email: 'invalid-email'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should validate enum values when provided', async () => {
      const dto = plainToClass(UpdateWorkerDto, {
        role: 'INVALID_ROLE',
        status: 'INVALID_STATUS'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'role')).toBe(true);
      expect(errors.some(e => e.property === 'status')).toBe(true);
    });

    it('should allow empty object', async () => {
      const dto = plainToClass(UpdateWorkerDto, {});

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('WorkerFilterDto', () => {
    it('should validate valid filter data', async () => {
      const dto = plainToClass(WorkerFilterDto, {
        role: Role.WORKER,
        status: UserStatus.WORKING,
        name: 'John',
        email: 'john@example.com'
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should allow empty filter', async () => {
      const dto = plainToClass(WorkerFilterDto, {});

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate enum values when provided', async () => {
      const dto = plainToClass(WorkerFilterDto, {
        role: 'INVALID_ROLE',
        status: 'INVALID_STATUS'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'role')).toBe(true);
      expect(errors.some(e => e.property === 'status')).toBe(true);
    });

    it('should validate string fields', async () => {
      const dto = plainToClass(WorkerFilterDto, {
        name: 123,
        email: 456
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'name')).toBe(true);
      expect(errors.some(e => e.property === 'email')).toBe(true);
    });

    it('should validate email format when provided', async () => {
      const dto = plainToClass(WorkerFilterDto, {
        email: 'invalid-email-format'
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should allow partial filters', async () => {
      const dto = plainToClass(WorkerFilterDto, {
        role: Role.FARM_OWNER
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle null values', async () => {
      const dto = plainToClass(CreateWorkerDto, {
        email: null,
        name: null
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should handle undefined values', async () => {
      const dto = plainToClass(CreateWorkerDto, {
        email: undefined,
        name: undefined
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should handle empty strings', async () => {
      const dto = plainToClass(CreateWorkerDto, {
        email: '',
        name: ''
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
}); 