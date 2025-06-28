import { IsString, IsNumber, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LandStatus } from '@prisma/client';

export class CreateLandPlotDto {
  @ApiProperty({ example: 'Plot A1' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Loamy' })
  @IsString()
  soilType: string;

  @ApiProperty({ example: 120.5 })
  @IsNumber()
  area: number;

  @ApiProperty({ example: { lat: 10.762622, lng: 106.660172 } })
  @IsOptional()
  coordinates?: any;

  @ApiProperty({ example: 'EMPTY', enum: LandStatus })
  @IsOptional()
  @IsEnum(LandStatus)
  status?: LandStatus;

  @ApiProperty({ example: 'Good soil quality' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'Tomato' })
  @IsOptional()
  @IsString()
  lastSeasonCrop?: string;

  @ApiProperty({ example: 'zone-id-here' })
  @IsUUID()
  zoneId: string;
}

export class UpdateLandPlotDto {
  @ApiProperty({ example: 'Plot A1' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Loamy' })
  @IsOptional()
  @IsString()
  soilType?: string;

  @ApiProperty({ example: 120.5 })
  @IsOptional()
  @IsNumber()
  area?: number;

  @ApiProperty({ example: { lat: 10.762622, lng: 106.660172 } })
  @IsOptional()
  coordinates?: any;

  @ApiProperty({ example: 'IN_USE', enum: LandStatus })
  @IsOptional()
  @IsEnum(LandStatus)
  status?: LandStatus;

  @ApiProperty({ example: 'Good soil quality' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'Tomato' })
  @IsOptional()
  @IsString()
  lastSeasonCrop?: string;
}

export class LandPlotFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  zoneId?: string;

  @ApiProperty({ required: false, enum: LandStatus })
  @IsOptional()
  @IsEnum(LandStatus)
  status?: LandStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  soilType?: string;
} 