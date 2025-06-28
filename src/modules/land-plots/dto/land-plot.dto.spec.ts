import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateLandPlotDto, UpdateLandPlotDto, LandPlotFilterDto } from './land-plot.dto';
import { LandStatus } from '@prisma/client';

describe('Land Plot DTOs', () => {
  describe('CreateLandPlotDto', () => {
    it('should create valid DTO with all required fields', async () => {
      const dto = plainToClass(CreateLandPlotDto, {
        name: 'Plot A1',
        soilType: 'Loamy',
        area: 120.5,
        coordinates: { lat: 10.762622, lng: 106.660172 },
        status: LandStatus.EMPTY,
        notes: 'Good soil quality',
        lastSeasonCrop: 'Tomato',
        zoneId: '123e4567-e89b-12d3-a456-426614174000'
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should create valid DTO with minimal required fields', async () => {
      const dto = plainToClass(CreateLandPlotDto, {
        name: 'Plot A1',
        soilType: 'Loamy',
        area: 120.5,
        zoneId: '123e4567-e89b-12d3-a456-426614174000'
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate required fields', async () => {
      const dto = plainToClass(CreateLandPlotDto, {});
      const errors = await validate(dto);
      
      expect(errors.length).toBeGreaterThan(0);
      const errorMessages = errors.map(error => error.property);
      expect(errorMessages).toContain('name');
      expect(errorMessages).toContain('soilType');
      expect(errorMessages).toContain('area');
      expect(errorMessages).toContain('zoneId');
    });

    it('should validate numeric fields', async () => {
      const dto = plainToClass(CreateLandPlotDto, {
        name: 'Plot A1',
        soilType: 'Loamy',
        area: 'invalid',
        zoneId: '123e4567-e89b-12d3-a456-426614174000'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('area');
    });

    it('should validate UUID format', async () => {
      const dto = plainToClass(CreateLandPlotDto, {
        name: 'Plot A1',
        soilType: 'Loamy',
        area: 120.5,
        zoneId: 'invalid-uuid'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('zoneId');
    });

    it('should validate enum values', async () => {
      const dto = plainToClass(CreateLandPlotDto, {
        name: 'Plot A1',
        soilType: 'Loamy',
        area: 120.5,
        status: 'INVALID_STATUS',
        zoneId: '123e4567-e89b-12d3-a456-426614174000'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('status');
    });

    it('should accept valid coordinates object', async () => {
      const dto = plainToClass(CreateLandPlotDto, {
        name: 'Plot A1',
        soilType: 'Loamy',
        area: 120.5,
        coordinates: { lat: 10.762622, lng: 106.660172 },
        zoneId: '123e4567-e89b-12d3-a456-426614174000'
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('UpdateLandPlotDto', () => {
    it('should create valid DTO with all fields optional', async () => {
      const dto = plainToClass(UpdateLandPlotDto, {});
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate provided fields', async () => {
      const dto = plainToClass(UpdateLandPlotDto, {
        name: 'Updated Plot A1',
        soilType: 'Sandy',
        area: 150.0,
        status: LandStatus.IN_USE,
        notes: 'Updated notes',
        lastSeasonCrop: 'Corn',
        coordinates: { lat: 10.8, lng: 106.7 }
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate numeric fields', async () => {
      const dto = plainToClass(UpdateLandPlotDto, {
        area: 'invalid'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('area');
    });

    it('should validate enum values', async () => {
      const dto = plainToClass(UpdateLandPlotDto, {
        status: 'INVALID_STATUS'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('status');
    });

    it('should accept partial updates', async () => {
      const dto1 = plainToClass(UpdateLandPlotDto, { name: 'New Name' });
      const dto2 = plainToClass(UpdateLandPlotDto, { area: 200.0 });
      const dto3 = plainToClass(UpdateLandPlotDto, { status: LandStatus.EMPTY });

      const errors1 = await validate(dto1);
      const errors2 = await validate(dto2);
      const errors3 = await validate(dto3);

      expect(errors1).toHaveLength(0);
      expect(errors2).toHaveLength(0);
      expect(errors3).toHaveLength(0);
    });
  });

  describe('LandPlotFilterDto', () => {
    it('should create valid DTO with all fields optional', async () => {
      const dto = plainToClass(LandPlotFilterDto, {});
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate provided fields', async () => {
      const dto = plainToClass(LandPlotFilterDto, {
        zoneId: '123e4567-e89b-12d3-a456-426614174000',
        status: LandStatus.EMPTY,
        soilType: 'Loamy'
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate UUID format', async () => {
      const dto = plainToClass(LandPlotFilterDto, {
        zoneId: 'invalid-uuid'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('zoneId');
    });

    it('should validate enum values', async () => {
      const dto = plainToClass(LandPlotFilterDto, {
        status: 'INVALID_STATUS'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('status');
    });

    it('should accept partial filters', async () => {
      const dto1 = plainToClass(LandPlotFilterDto, { zoneId: '123e4567-e89b-12d3-a456-426614174000' });
      const dto2 = plainToClass(LandPlotFilterDto, { status: LandStatus.EMPTY });
      const dto3 = plainToClass(LandPlotFilterDto, { soilType: 'Loamy' });

      const errors1 = await validate(dto1);
      const errors2 = await validate(dto2);
      const errors3 = await validate(dto3);

      expect(errors1).toHaveLength(0);
      expect(errors2).toHaveLength(0);
      expect(errors3).toHaveLength(0);
    });

    it('should accept multiple filters', async () => {
      const dto = plainToClass(LandPlotFilterDto, {
        zoneId: '123e4567-e89b-12d3-a456-426614174000',
        status: LandStatus.IN_USE,
        soilType: 'Sandy'
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });
}); 