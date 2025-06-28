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
import { CropsService } from './crops.service';
import { CreateCropDto, UpdateCropDto, CropFilterDto } from './dto/crop.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role, CropCategory } from '@prisma/client';

@ApiTags('Crops')
@Controller('crops')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CropsController {
  constructor(private readonly cropsService: CropsService) {}

  @Post()
  @Roles(Role.FARM_OWNER)
  @ApiOperation({ summary: 'Create a new crop' })
  @ApiResponse({
    status: 201,
    description: 'Crop created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Crop with this name already exists',
  })
  create(@Body() createCropDto: CreateCropDto) {
    return this.cropsService.create(createCropDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all crops with filters and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Crops retrieved successfully',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'category', required: false, enum: CropCategory })
  @ApiQuery({ name: 'status', required: false, enum: ['ACTIVE', 'INACTIVE'] })
  @ApiQuery({ name: 'name', required: false, type: String })
  findAll(@Query() paginationDto: PaginationDto, @Query() filters: CropFilterDto) {
    return this.cropsService.findAll(paginationDto, filters);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all crop categories' })
  @ApiResponse({
    status: 200,
    description: 'Crop categories retrieved successfully',
  })
  getCategories() {
    return this.cropsService.getCategories();
  }

  @Get('categories/:category')
  @ApiOperation({ summary: 'Get crops by category' })
  @ApiResponse({
    status: 200,
    description: 'Crops by category retrieved successfully',
  })
  getCropsByCategory(@Param('category') category: CropCategory) {
    return this.cropsService.getCropsByCategory(category);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active crops' })
  @ApiResponse({
    status: 200,
    description: 'Active crops retrieved successfully',
  })
  getActiveCrops() {
    return this.cropsService.getActiveCrops();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get crop statistics' })
  @ApiResponse({
    status: 200,
    description: 'Crop statistics retrieved successfully',
  })
  getCropStatistics() {
    return this.cropsService.getCropStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get crop by ID' })
  @ApiResponse({
    status: 200,
    description: 'Crop retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Crop not found',
  })
  findOne(@Param('id') id: string) {
    return this.cropsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.FARM_OWNER)
  @ApiOperation({ summary: 'Update crop' })
  @ApiResponse({
    status: 200,
    description: 'Crop updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Crop not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Crop with this name already exists',
  })
  update(@Param('id') id: string, @Body() updateCropDto: UpdateCropDto) {
    return this.cropsService.update(id, updateCropDto);
  }

  @Delete(':id')
  @Roles(Role.FARM_OWNER)
  @ApiOperation({ summary: 'Delete crop' })
  @ApiResponse({
    status: 200,
    description: 'Crop deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Crop not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete crop with active plantings',
  })
  remove(@Param('id') id: string) {
    return this.cropsService.remove(id);
  }
} 