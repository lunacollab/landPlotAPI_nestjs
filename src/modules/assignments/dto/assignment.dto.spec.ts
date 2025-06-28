import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateAssignmentDto, UpdateAssignmentDto, AssignmentFilterDto } from './assignment.dto';
import { WorkStatus, PaymentStatus } from '@prisma/client';

describe('Assignment DTOs', () => {
  describe('CreateAssignmentDto', () => {
    it('should create valid DTO with all required fields', async () => {
      const dto = plainToClass(CreateAssignmentDto, {
        workDate: '2024-01-15T08:00:00Z',
        startTime: '2024-01-15T08:00:00Z',
        endTime: '2024-01-15T12:00:00Z',
        hourlyRate: 15.0,
        task: 'Soil preparation for tomato planting',
        landArea: 100.0,
        cropType: 'Tomato',
        status: WorkStatus.ASSIGNED,
        paymentStatus: PaymentStatus.PENDING,
        workerId: 'worker-id',
        landPlotId: 'land-plot-id'
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should create valid DTO with minimal required fields', async () => {
      const dto = plainToClass(CreateAssignmentDto, {
        workDate: '2024-01-15T08:00:00Z',
        startTime: '2024-01-15T08:00:00Z',
        endTime: '2024-01-15T12:00:00Z',
        hourlyRate: 15.0,
        task: 'Soil preparation',
        landArea: 100.0,
        workerId: 'worker-id',
        landPlotId: 'land-plot-id'
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate required fields', async () => {
      const dto = plainToClass(CreateAssignmentDto, {});
      const errors = await validate(dto);
      
      expect(errors.length).toBeGreaterThan(0);
      const errorMessages = errors.map(error => error.property);
      expect(errorMessages).toContain('workDate');
      expect(errorMessages).toContain('startTime');
      expect(errorMessages).toContain('endTime');
      expect(errorMessages).toContain('hourlyRate');
      expect(errorMessages).toContain('task');
      expect(errorMessages).toContain('landArea');
      expect(errorMessages).toContain('workerId');
      expect(errorMessages).toContain('landPlotId');
    });

    it('should validate date strings', async () => {
      const dto = plainToClass(CreateAssignmentDto, {
        workDate: 'invalid-date',
        startTime: '2024-01-15T08:00:00Z',
        endTime: '2024-01-15T12:00:00Z',
        hourlyRate: 15.0,
        task: 'Soil preparation',
        landArea: 100.0,
        workerId: 'worker-id',
        landPlotId: 'land-plot-id'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('workDate');
    });

    it('should validate numeric fields', async () => {
      const dto = plainToClass(CreateAssignmentDto, {
        workDate: '2024-01-15T08:00:00Z',
        startTime: '2024-01-15T08:00:00Z',
        endTime: '2024-01-15T12:00:00Z',
        hourlyRate: 'invalid',
        task: 'Soil preparation',
        landArea: 'invalid',
        workerId: 'worker-id',
        landPlotId: 'land-plot-id'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should validate enum values', async () => {
      const dto = plainToClass(CreateAssignmentDto, {
        workDate: '2024-01-15T08:00:00Z',
        startTime: '2024-01-15T08:00:00Z',
        endTime: '2024-01-15T12:00:00Z',
        hourlyRate: 15.0,
        task: 'Soil preparation',
        landArea: 100.0,
        status: 'INVALID_STATUS',
        paymentStatus: 'INVALID_PAYMENT',
        workerId: 'worker-id',
        landPlotId: 'land-plot-id'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('UpdateAssignmentDto', () => {
    it('should create valid DTO with all fields optional', async () => {
      const dto = plainToClass(UpdateAssignmentDto, {});
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate provided fields', async () => {
      const dto = plainToClass(UpdateAssignmentDto, {
        workDate: '2024-01-15T08:00:00Z',
        hourlyRate: 20.0,
        task: 'Updated task',
        status: WorkStatus.IN_PROGRESS
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate date strings', async () => {
      const dto = plainToClass(UpdateAssignmentDto, {
        workDate: 'invalid-date'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('workDate');
    });

    it('should validate numeric fields', async () => {
      const dto = plainToClass(UpdateAssignmentDto, {
        hourlyRate: 'invalid',
        landArea: 'invalid'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should validate enum values', async () => {
      const dto = plainToClass(UpdateAssignmentDto, {
        status: 'INVALID_STATUS',
        paymentStatus: 'INVALID_PAYMENT'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('AssignmentFilterDto', () => {
    it('should create valid DTO with all fields optional', async () => {
      const dto = plainToClass(AssignmentFilterDto, {});
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate provided fields', async () => {
      const dto = plainToClass(AssignmentFilterDto, {
        status: WorkStatus.ASSIGNED,
        paymentStatus: PaymentStatus.PENDING,
        workerId: 'worker-id',
        landPlotId: 'land-plot-id',
        workDate: '2024-01-15T08:00:00Z',
        cropType: 'Tomato'
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate date strings', async () => {
      const dto = plainToClass(AssignmentFilterDto, {
        workDate: 'invalid-date'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('workDate');
    });

    it('should validate enum values', async () => {
      const dto = plainToClass(AssignmentFilterDto, {
        status: 'INVALID_STATUS',
        paymentStatus: 'INVALID_PAYMENT'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should accept partial filters', async () => {
      const dto1 = plainToClass(AssignmentFilterDto, { status: WorkStatus.ASSIGNED });
      const dto2 = plainToClass(AssignmentFilterDto, { workerId: 'worker-id' });
      const dto3 = plainToClass(AssignmentFilterDto, { cropType: 'Tomato' });

      const errors1 = await validate(dto1);
      const errors2 = await validate(dto2);
      const errors3 = await validate(dto3);

      expect(errors1).toHaveLength(0);
      expect(errors2).toHaveLength(0);
      expect(errors3).toHaveLength(0);
    });
  });
}); 