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
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto, UpdateAssignmentDto, AssignmentFilterDto } from './dto/assignment.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role, WorkStatus } from '@prisma/client';

@ApiTags('Assignments')
@Controller('assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @Roles(Role.FARM_OWNER)
  @ApiOperation({ summary: 'Create a new assignment' })
  @ApiResponse({
    status: 201,
    description: 'Assignment created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Time conflict with existing assignment on this land plot',
  })
  create(@Body() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentsService.create(createAssignmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all assignments with filters and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Assignments retrieved successfully',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'status', required: false, enum: WorkStatus })
  @ApiQuery({ name: 'paymentStatus', required: false, enum: ['PENDING', 'PAID', 'CANCELLED'] })
  @ApiQuery({ name: 'workerId', required: false, type: String })
  @ApiQuery({ name: 'landPlotId', required: false, type: String })
  @ApiQuery({ name: 'workDate', required: false, type: Date })
  @ApiQuery({ name: 'cropType', required: false, type: String })
  findAll(@Query() paginationDto: PaginationDto, @Query() filters: AssignmentFilterDto) {
    return this.assignmentsService.findAll(paginationDto, filters);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get assignment statistics' })
  @ApiResponse({
    status: 200,
    description: 'Assignment statistics retrieved successfully',
  })
  getAssignmentStatistics() {
    return this.assignmentsService.getAssignmentStatistics();
  }

  @Get('by-date')
  @ApiOperation({ summary: 'Get assignments by date' })
  @ApiResponse({
    status: 200,
    description: 'Assignments by date retrieved successfully',
  })
  @ApiQuery({ name: 'date', required: true, type: Date })
  getAssignmentsByDate(@Query('date') date: Date) {
    return this.assignmentsService.getAssignmentsByDate(date);
  }

  @Get('worker/:workerId')
  @ApiOperation({ summary: 'Get worker assignments' })
  @ApiResponse({
    status: 200,
    description: 'Worker assignments retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Worker not found',
  })
  getWorkerAssignments(@Param('workerId') workerId: string) {
    return this.assignmentsService.getWorkerAssignments(workerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assignment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Assignment retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Assignment not found',
  })
  findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.FARM_OWNER)
  @ApiOperation({ summary: 'Update assignment' })
  @ApiResponse({
    status: 200,
    description: 'Assignment updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Assignment not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Time conflict with existing assignment on this land plot',
  })
  update(@Param('id') id: string, @Body() updateAssignmentDto: UpdateAssignmentDto) {
    return this.assignmentsService.update(id, updateAssignmentDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update assignment status' })
  @ApiResponse({
    status: 200,
    description: 'Assignment status updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Assignment not found',
  })
  updateStatus(@Param('id') id: string, @Body('status') status: WorkStatus) {
    return this.assignmentsService.updateStatus(id, status);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start assignment' })
  @ApiResponse({
    status: 200,
    description: 'Assignment started successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Assignment not found',
  })
  startAssignment(@Param('id') id: string) {
    return this.assignmentsService.startAssignment(id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete assignment' })
  @ApiResponse({
    status: 200,
    description: 'Assignment completed successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Assignment not found',
  })
  completeAssignment(@Param('id') id: string) {
    return this.assignmentsService.completeAssignment(id);
  }

  @Delete(':id')
  @Roles(Role.FARM_OWNER)
  @ApiOperation({ summary: 'Delete assignment' })
  @ApiResponse({
    status: 200,
    description: 'Assignment deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Assignment not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete completed assignment',
  })
  remove(@Param('id') id: string) {
    return this.assignmentsService.remove(id);
  }
} 