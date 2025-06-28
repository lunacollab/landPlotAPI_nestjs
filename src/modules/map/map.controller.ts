import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MapService } from './map.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Map')
@Controller('map')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('zones')
  @ApiOperation({ summary: 'Get zone map data' })
  @ApiResponse({
    status: 200,
    description: 'Zone map data retrieved successfully',
  })
  getZoneMapData() {
    return this.mapService.getZoneMapData();
  }

  @Get('land-plots')
  @ApiOperation({ summary: 'Get land plot coordinates' })
  @ApiResponse({
    status: 200,
    description: 'Land plot coordinates retrieved successfully',
  })
  getLandPlotCoordinates() {
    return this.mapService.getLandPlotCoordinates();
  }

  @Get('land-plots/:id/highlight')
  @ApiOperation({ summary: 'Highlight specific land plot' })
  @ApiResponse({
    status: 200,
    description: 'Land plot highlight data retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Land plot not found',
  })
  getLandPlotHighlight(@Param('id') id: string) {
    return this.mapService.getLandPlotHighlight(id);
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get map overview statistics' })
  @ApiResponse({
    status: 200,
    description: 'Map overview retrieved successfully',
  })
  getMapOverview() {
    return this.mapService.getMapOverview();
  }

  @Get('zones/:id')
  @ApiOperation({ summary: 'Get zone details' })
  @ApiResponse({
    status: 200,
    description: 'Zone details retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Zone not found',
  })
  getZoneDetails(@Param('id') id: string) {
    return this.mapService.getZoneDetails(id);
  }
} 