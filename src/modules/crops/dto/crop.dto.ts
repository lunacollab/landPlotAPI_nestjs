import { IsString, IsNumber, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CropCategory, CropStatus } from '@prisma/client';

export class CreateCropDto {
  @ApiProperty({ example: 'Orange' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'FRUIT', enum: CropCategory })
  @IsEnum(CropCategory)
  category: CropCategory;

  @ApiProperty({ example: 3 })
  @IsNumber()
  varietyCount: number;

  @ApiProperty({ example: 180 })
  @IsNumber()
  daysToHarvest: number;

  @ApiProperty({ example: ['Spring', 'Summer'] })
  @IsOptional()
  @IsArray()
  suggestedPlantingTime?: string[];

  @ApiProperty({ example: 25.5 })
  @IsOptional()
  @IsNumber()
  expectedYield?: number;

  @ApiProperty({ example: 'ACTIVE', enum: CropStatus })
  @IsOptional()
  @IsEnum(CropStatus)
  status?: CropStatus;

  @ApiProperty({ example: { seasons: ['2023-Q1'], notes: 'Good yield' } })
  @IsOptional()
  careHistory?: any;
}

export class UpdateCropDto {
  @ApiProperty({ example: 'Orange' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'FRUIT', enum: CropCategory })
  @IsOptional()
  @IsEnum(CropCategory)
  category?: CropCategory;

  @ApiProperty({ example: 3 })
  @IsOptional()
  @IsNumber()
  varietyCount?: number;

  @ApiProperty({ example: 180 })
  @IsOptional()
  @IsNumber()
  daysToHarvest?: number;

  @ApiProperty({ example: ['Spring', 'Summer'] })
  @IsOptional()
  @IsArray()
  suggestedPlantingTime?: string[];

  @ApiProperty({ example: 25.5 })
  @IsOptional()
  @IsNumber()
  expectedYield?: number;

  @ApiProperty({ example: 'ACTIVE', enum: CropStatus })
  @IsOptional()
  @IsEnum(CropStatus)
  status?: CropStatus;

  @ApiProperty({ example: { seasons: ['2023-Q1'], notes: 'Good yield' } })
  @IsOptional()
  careHistory?: any;
}

export class CropFilterDto {
  @ApiProperty({ required: false, enum: CropCategory })
  @IsOptional()
  @IsEnum(CropCategory)
  category?: CropCategory;

  @ApiProperty({ required: false, enum: CropStatus })
  @IsOptional()
  @IsEnum(CropStatus)
  status?: CropStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;
} 