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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { LandPlotsService } from './land-plots.service';
import { CreateLandPlotDto, UpdateLandPlotDto, LandPlotFilterDto } from './dto/land-plot.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role, LandStatus } from '@prisma/client';

@ApiTags('Land Plots')
@Controller('land-plots')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LandPlotsController {
  constructor(private readonly landPlotsService: LandPlotsService) {}

  @Post()
  @Roles(Role.FARM_OWNER)
  @ApiOperation({ summary: 'Create a new land plot' })
  @ApiResponse({
    status: 201,
    description: 'Land plot created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Land plot with this name already exists in zone',
  })
  create(@Body() createLandPlotDto: CreateLandPlotDto) {
    return this.landPlotsService.create(createLandPlotDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all land plots with filters and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Land plots retrieved successfully',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'zoneId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: LandStatus })
  @ApiQuery({ name: 'soilType', required: false, type: String })
  findAll(@Query() paginationDto: PaginationDto, @Query() filters: LandPlotFilterDto) {
    return this.landPlotsService.findAll(paginationDto, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get land plot by ID' })
  @ApiResponse({
    status: 200,
    description: 'Land plot retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Land plot not found',
  })
  findOne(@Param('id') id: string) {
    return this.landPlotsService.findOne(id);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get land plot usage history' })
  @ApiResponse({
    status: 200,
    description: 'Land plot history retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Land plot not found',
  })
  getHistory(@Param('id') id: string) {
    return this.landPlotsService.getHistory(id);
  }

  @Get(':id/schedule')
  @ApiOperation({ summary: 'Get land plot planting schedule' })
  @ApiResponse({
    status: 200,
    description: 'Land plot schedule retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Land plot not found',
  })
  getSchedule(@Param('id') id: string) {
    return this.landPlotsService.getSchedule(id);
  }

  @Patch(':id')
  @Roles(Role.FARM_OWNER)
  @ApiOperation({ summary: 'Update land plot' })
  @ApiResponse({
    status: 200,
    description: 'Land plot updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Land plot not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Land plot with this name already exists in zone',
  })
  update(@Param('id') id: string, @Body() updateLandPlotDto: UpdateLandPlotDto) {
    return this.landPlotsService.update(id, updateLandPlotDto);
  }

  @Patch(':id/status')
  @Roles(Role.FARM_OWNER)
  @ApiOperation({ summary: 'Update land plot status' })
  @ApiResponse({
    status: 200,
    description: 'Land plot status updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Land plot not found',
  })
  updateStatus(@Param('id') id: string, @Body('status') status: LandStatus) {
    return this.landPlotsService.updateStatus(id, status);
  }

  @Post(':id/images')
  @Roles(Role.FARM_OWNER)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload land plot image' })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Land plot not found',
  })
  uploadImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    // In a real implementation, you would upload the file to cloud storage
    // and return the URL. For now, we'll simulate it.
    const imageUrl = `uploads/land-plots/${id}/${file.filename}`;
    return this.landPlotsService.uploadImage(id, imageUrl);
  }

  @Delete(':id')
  @Roles(Role.FARM_OWNER)
  @ApiOperation({ summary: 'Delete land plot' })
  @ApiResponse({
    status: 200,
    description: 'Land plot deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Land plot not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete land plot with active crops, services, or assignments',
  })
  remove(@Param('id') id: string) {
    return this.landPlotsService.remove(id);
  }
} 