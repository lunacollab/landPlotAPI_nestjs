import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ServiceStatus } from '@prisma/client';

export class CreateServiceDto {
  @ApiProperty({ example: 'SOIL_PREP' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Soil Preparation' })
  @IsString()
  name: string;

  @ApiProperty({ example: 2.5 })
  @IsNumber()
  costPerSqm: number;

  @ApiProperty({ example: 4 })
  @IsNumber()
  duration: number;

  @ApiProperty({ example: 'ACTIVE', enum: ServiceStatus })
  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus;
}

export class UpdateServiceDto {
  @ApiProperty({ example: 'SOIL_PREP' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ example: 'Soil Preparation' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 2.5 })
  @IsOptional()
  @IsNumber()
  costPerSqm?: number;

  @ApiProperty({ example: 4 })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({ example: 'ACTIVE', enum: ServiceStatus })
  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus;
}

export class ServiceFilterDto {
  @ApiProperty({ required: false, enum: ServiceStatus })
  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  code?: string;
} 