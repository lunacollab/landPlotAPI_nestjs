import { IsString, IsOptional, IsHexColor } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateZoneDto {
  @ApiProperty({ example: 'A' })
  @IsString()
  name: string;

  @ApiProperty({ example: '#FF5733' })
  @IsHexColor()
  color: string;

  @ApiProperty({ example: 'Zone A Address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: { lat: 10.762622, lng: 106.660172 } })
  @IsOptional()
  coordinates?: any;
}

export class UpdateZoneDto {
  @ApiProperty({ example: 'A' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '#FF5733' })
  @IsOptional()
  @IsHexColor()
  color?: string;

  @ApiProperty({ example: 'Zone A Address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: { lat: 10.762622, lng: 106.660172 } })
  @IsOptional()
  coordinates?: any;
} 