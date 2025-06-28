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
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto, ServiceFilterDto } from './dto/service.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role, ServiceStatus } from '@prisma/client';

@ApiTags('Services')
@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @Roles(Role.FARM_OWNER)
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({
    status: 201,
    description: 'Service created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Service with this code already exists',
  })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services with filters and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Services retrieved successfully',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'status', required: false, enum: ServiceStatus })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'code', required: false, type: String })
  findAll(@Query() paginationDto: PaginationDto, @Query() filters: ServiceFilterDto) {
    return this.servicesService.findAll(paginationDto, filters);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active services' })
  @ApiResponse({
    status: 200,
    description: 'Active services retrieved successfully',
  })
  getActiveServices() {
    return this.servicesService.getActiveServices();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get service statistics' })
  @ApiResponse({
    status: 200,
    description: 'Service statistics retrieved successfully',
  })
  getServiceStatistics() {
    return this.servicesService.getServiceStatistics();
  }

  @Get('calculate-cost')
  @ApiOperation({ summary: 'Calculate service cost for a given area' })
  @ApiResponse({
    status: 200,
    description: 'Service cost calculated successfully',
  })
  @ApiQuery({ name: 'serviceId', required: true, type: String })
  @ApiQuery({ name: 'area', required: true, type: Number })
  calculateServiceCost(
    @Query('serviceId') serviceId: string,
    @Query('area') area: number,
  ) {
    return this.servicesService.calculateServiceCost(serviceId, area);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiResponse({
    status: 200,
    description: 'Service retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found',
  })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.FARM_OWNER)
  @ApiOperation({ summary: 'Update service' })
  @ApiResponse({
    status: 200,
    description: 'Service updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Service with this code already exists',
  })
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @Roles(Role.FARM_OWNER)
  @ApiOperation({ summary: 'Delete service' })
  @ApiResponse({
    status: 200,
    description: 'Service deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete service with active land services',
  })
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
} 