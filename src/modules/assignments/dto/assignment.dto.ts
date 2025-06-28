import { IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WorkStatus, PaymentStatus } from '@prisma/client';

export class CreateAssignmentDto {
  @ApiProperty({ example: '2024-01-15T08:00:00Z' })
  @IsDateString()
  workDate: Date;

  @ApiProperty({ example: '2024-01-15T08:00:00Z' })
  @IsDateString()
  startTime: Date;

  @ApiProperty({ example: '2024-01-15T12:00:00Z' })
  @IsDateString()
  endTime: Date;

  @ApiProperty({ example: 15.0 })
  @IsNumber()
  hourlyRate: number;

  @ApiProperty({ example: 'Soil preparation for tomato planting' })
  @IsString()
  task: string;

  @ApiProperty({ example: 100.0 })
  @IsNumber()
  landArea: number;

  @ApiProperty({ example: 'Tomato' })
  @IsOptional()
  @IsString()
  cropType?: string;

  @ApiProperty({ example: 'ASSIGNED', enum: WorkStatus })
  @IsOptional()
  @IsEnum(WorkStatus)
  status?: WorkStatus;

  @ApiProperty({ example: 'PENDING', enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiProperty({ example: 'worker-id' })
  @IsString()
  workerId: string;

  @ApiProperty({ example: 'land-plot-id' })
  @IsString()
  landPlotId: string;
}

export class UpdateAssignmentDto {
  @ApiProperty({ example: '2024-01-15T08:00:00Z' })
  @IsOptional()
  @IsDateString()
  workDate?: Date;

  @ApiProperty({ example: '2024-01-15T08:00:00Z' })
  @IsOptional()
  @IsDateString()
  startTime?: Date;

  @ApiProperty({ example: '2024-01-15T12:00:00Z' })
  @IsOptional()
  @IsDateString()
  endTime?: Date;

  @ApiProperty({ example: 15.0 })
  @IsOptional()
  @IsNumber()
  hourlyRate?: number;

  @ApiProperty({ example: 'Soil preparation for tomato planting' })
  @IsOptional()
  @IsString()
  task?: string;

  @ApiProperty({ example: 100.0 })
  @IsOptional()
  @IsNumber()
  landArea?: number;

  @ApiProperty({ example: 'Tomato' })
  @IsOptional()
  @IsString()
  cropType?: string;

  @ApiProperty({ example: 'ASSIGNED', enum: WorkStatus })
  @IsOptional()
  @IsEnum(WorkStatus)
  status?: WorkStatus;

  @ApiProperty({ example: 'PENDING', enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;
}

export class AssignmentFilterDto {
  @ApiProperty({ required: false, enum: WorkStatus })
  @IsOptional()
  @IsEnum(WorkStatus)
  status?: WorkStatus;

  @ApiProperty({ required: false, enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  workerId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  landPlotId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  workDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cropType?: string;
} 