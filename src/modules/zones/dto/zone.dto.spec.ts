import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateZoneDto, UpdateZoneDto } from './zone.dto';

describe('Zone DTOs', () => {
  describe('CreateZoneDto', () => {
    it('should create valid DTO with all required fields', async () => {
      const dto = plainToClass(CreateZoneDto, {
        name: 'Zone A',
        color: '#FF5733',
        address: 'Zone A Address',
        coordinates: { lat: 10.762622, lng: 106.660172 }
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should create valid DTO with minimal required fields', async () => {
      const dto = plainToClass(CreateZoneDto, {
        name: 'Zone A',
        color: '#FF5733'
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate required fields', async () => {
      const dto = plainToClass(CreateZoneDto, {});
      const errors = await validate(dto);
      
      expect(errors.length).toBeGreaterThan(0);
      const errorMessages = errors.map(error => error.property);
      expect(errorMessages).toContain('name');
      expect(errorMessages).toContain('color');
    });

    it('should validate hex color format', async () => {
      const dto = plainToClass(CreateZoneDto, {
        name: 'Zone A',
        color: 'invalid-color'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('color');
    });

    it('should accept valid hex colors', async () => {
      const validColors = ['#FF5733', '#00FF00', '#000000', '#FFFFFF', '#123456'];
      
      for (const color of validColors) {
        const dto = plainToClass(CreateZoneDto, {
          name: 'Zone A',
          color: color
        });

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should accept valid coordinates object', async () => {
      const dto = plainToClass(CreateZoneDto, {
        name: 'Zone A',
        color: '#FF5733',
        coordinates: { lat: 10.762622, lng: 106.660172 }
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should accept string address', async () => {
      const dto = plainToClass(CreateZoneDto, {
        name: 'Zone A',
        color: '#FF5733',
        address: '123 Main Street, City, Country'
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('UpdateZoneDto', () => {
    it('should create valid DTO with all fields optional', async () => {
      const dto = plainToClass(UpdateZoneDto, {});
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate provided fields', async () => {
      const dto = plainToClass(UpdateZoneDto, {
        name: 'Updated Zone A',
        color: '#00FF00',
        address: 'Updated Address',
        coordinates: { lat: 10.8, lng: 106.7 }
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate hex color format', async () => {
      const dto = plainToClass(UpdateZoneDto, {
        color: 'invalid-color'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('color');
    });

    it('should accept valid hex colors', async () => {
      const validColors = ['#FF5733', '#00FF00', '#000000', '#FFFFFF', '#123456'];
      
      for (const color of validColors) {
        const dto = plainToClass(UpdateZoneDto, {
          color: color
        });

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should accept partial updates', async () => {
      const dto1 = plainToClass(UpdateZoneDto, { name: 'New Name' });
      const dto2 = plainToClass(UpdateZoneDto, { color: '#FF5733' });
      const dto3 = plainToClass(UpdateZoneDto, { address: 'New Address' });

      const errors1 = await validate(dto1);
      const errors2 = await validate(dto2);
      const errors3 = await validate(dto3);

      expect(errors1).toHaveLength(0);
      expect(errors2).toHaveLength(0);
      expect(errors3).toHaveLength(0);
    });

    it('should accept multiple updates', async () => {
      const dto = plainToClass(UpdateZoneDto, {
        name: 'Updated Zone A',
        color: '#00FF00',
        address: 'Updated Address',
        coordinates: { lat: 10.8, lng: 106.7 }
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });
}); 