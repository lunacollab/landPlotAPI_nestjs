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
import { WorkersService } from './workers.service';
import { CreateWorkerDto, UpdateWorkerDto, WorkerFilterDto } from './dto/worker.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role, UserStatus } from '@prisma/client';

@ApiTags('Workers')
@Controller('workers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all workers with filters and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Workers retrieved successfully',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'role', required: false, enum: Role })
  @ApiQuery({ name: 'status', required: false, enum: UserStatus })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  findAll(@Query() paginationDto: PaginationDto, @Query() filters: WorkerFilterDto) {
    return this.workersService.findAll(paginationDto, filters);
  }

  @Get('working')
  @ApiOperation({ summary: 'Get all working workers' })
  @ApiResponse({
    status: 200,
    description: 'Working workers retrieved successfully',
  })
  getWorkingWorkers() {
    return this.workersService.getWorkingWorkers();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get worker statistics' })
  @ApiResponse({
    status: 200,
    description: 'Worker statistics retrieved successfully',
  })
  getWorkerStatistics() {
    return this.workersService.getWorkerStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get worker by ID' })
  @ApiResponse({
    status: 200,
    description: 'Worker retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Worker not found',
  })
  findOne(@Param('id') id: string) {
    return this.workersService.findOne(id);
  }

  @Get(':id/assignments')
  @ApiOperation({ summary: 'Get worker assignments' })
  @ApiResponse({
    status: 200,
    description: 'Worker assignments retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Worker not found',
  })
  getWorkerAssignments(@Param('id') id: string) {
    return this.workersService.getWorkerAssignments(id);
  }

  @Get(':id/schedule')
  @ApiOperation({ summary: 'Get worker schedule' })
  @ApiResponse({
    status: 200,
    description: 'Worker schedule retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Worker not found',
  })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  getWorkerSchedule(
    @Param('id') id: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.workersService.getWorkerSchedule(id, startDate, endDate);
  }

  @Patch(':id')
  @Roles(Role.FARM_OWNER)
  @ApiOperation({ summary: 'Update worker' })
  @ApiResponse({
    status: 200,
    description: 'Worker updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Worker not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Worker with this email already exists',
  })
  update(@Param('id') id: string, @Body() updateWorkerDto: UpdateWorkerDto) {
    return this.workersService.update(id, updateWorkerDto);
  }

  @Delete(':id')
  @Roles(Role.FARM_OWNER)
  @ApiOperation({ summary: 'Delete worker' })
  @ApiResponse({
    status: 200,
    description: 'Worker deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Worker not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete worker with active assignments or schedules',
  })
  remove(@Param('id') id: string) {
    return this.workersService.remove(id);
  }
} 