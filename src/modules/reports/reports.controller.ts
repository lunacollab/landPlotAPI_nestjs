import {
  Controller,
  Get,
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
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('land-utilization')
  @Roles(Role.FARM_OWNER)
  @ApiOperation({ summary: 'Get land utilization report' })
  @ApiResponse({
    status: 200,
    description: 'Land utilization report retrieved successfully',
  })
  getLandUtilizationReport() {
    return this.reportsService.getLandUtilizationReport();
  }

  @Get('crop-yield')
  @Roles(Role.FARM_OWNER)
  @ApiOperation({ summary: 'Get crop yield report' })
  @ApiResponse({
    status: 200,
    description: 'Crop yield report retrieved successfully',
  })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  getCropYieldReport(
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.reportsService.getCropYieldReport(startDate, endDate);
  }

  @Get('worker-performance')
  @Roles(Role.FARM_OWNER)
  @ApiOperation({ summary: 'Get worker performance report' })
  @ApiResponse({
    status: 200,
    description: 'Worker performance report retrieved successfully',
  })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  getWorkerPerformanceReport(
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.reportsService.getWorkerPerformanceReport(startDate, endDate);
  }

  @Get('financial')
  @Roles(Role.FARM_OWNER)
  @ApiOperation({ summary: 'Get financial report' })
  @ApiResponse({
    status: 200,
    description: 'Financial report retrieved successfully',
  })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  getFinancialReport(
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.reportsService.getFinancialReport(startDate, endDate);
  }
} 