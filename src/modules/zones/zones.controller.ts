import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ZonesService } from './zones.service';
import { CreateZoneDto, UpdateZoneDto } from './dto/zone.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Zones')
@Controller('zones')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Post()
  @Roles(Role.FARM_OWNER)
  @ApiOperation({ summary: 'Create a new zone' })
  @ApiResponse({
    status: 201,
    description: 'Zone created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Zone with this name already exists',
  })
  create(@Body() createZoneDto: CreateZoneDto) {
    return this.zonesService.create(createZoneDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all zones with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Zones retrieved successfully',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.zonesService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get zone by ID' })
  @ApiResponse({
    status: 200,
    description: 'Zone retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Zone not found',
  })
  findOne(@Param('id') id: string) {
    return this.zonesService.findOne(id);
  }

  @Get(':id/land-plots')
  @ApiOperation({ summary: 'Get land plots in a zone' })
  @ApiResponse({
    status: 200,
    description: 'Land plots retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Zone not found',
  })
  getLandPlots(@Param('id') id: string) {
    return this.zonesService.getLandPlots(id);
  }

  @Patch(':id')
  @Roles(Role.FARM_OWNER)
  @ApiOperation({ summary: 'Update zone' })
  @ApiResponse({
    status: 200,
    description: 'Zone updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Zone not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Zone with this name already exists',
  })
  update(@Param('id') id: string, @Body() updateZoneDto: UpdateZoneDto) {
    return this.zonesService.update(id, updateZoneDto);
  }

  @Delete(':id')
  @Roles(Role.FARM_OWNER)
  @ApiOperation({ summary: 'Delete zone' })
  @ApiResponse({
    status: 200,
    description: 'Zone deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Zone not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete zone with existing land plots',
  })
  remove(@Param('id') id: string) {
    return this.zonesService.remove(id);
  }
} 