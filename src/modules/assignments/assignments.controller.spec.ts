import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { ResourceNotFoundException, ConflictException } from '../../common/exceptions/custom.exception';
import { CreateAssignmentDto } from './dto/assignment.dto';

describe('AssignmentsController', () => {
  let controller: AssignmentsController;
  let service: AssignmentsService;

  const mockService = {
    findAll: jest.fn(),
    create: jest.fn(),
    updateAssignmentStatus: jest.fn(),
    getWorkerAssignments: jest.fn(),
    startAssignment: jest.fn(),
    completeAssignment: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignmentsController],
      providers: [
        {
          provide: AssignmentsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AssignmentsController>(AssignmentsController);
    service = module.get<AssignmentsService>(AssignmentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all assignments', async () => {
      const mockArr = [
        { id: 'assignment-1', task: 'Planting' },
        { id: 'assignment-2', task: 'Harvesting' },
      ];
      mockService.findAll.mockResolvedValue(mockArr);
      expect(await controller.findAll({}, {})).toEqual(mockArr);
    });
  });

  describe('create', () => {
    it('should create an assignment', async () => {
      const dto: CreateAssignmentDto = { 
        workerId: '1', 
        landPlotId: '1', 
        task: 'task', 
        workDate: new Date(), 
        startTime: new Date('2024-01-15T08:00:00'), 
        endTime: new Date('2024-01-15T10:00:00'), 
        hourlyRate: 100, 
        landArea: 50 
      };
      const mockObj = { id: 'assignment-1', ...dto };
      mockService.create.mockResolvedValue(mockObj);
      expect(await controller.create(dto)).toEqual(mockObj);
    });
  });

  describe('getWorkerAssignments', () => {
    it('should return worker assignments', async () => {
      const mockArr = [
        { id: 'assignment-1', task: 'Planting' },
        { id: 'assignment-2', task: 'Harvesting' },
      ];
      mockService.getWorkerAssignments.mockResolvedValue(mockArr);
      expect(await controller.getWorkerAssignments('worker-1')).toEqual(mockArr);
    });
  });

  describe('startAssignment', () => {
    it('should start assignment', async () => {
      const mockObj = { id: 'assignment-1', status: 'IN_PROGRESS' };
      mockService.startAssignment.mockResolvedValue(mockObj);
      expect(await controller.startAssignment('assignment-1')).toEqual(mockObj);
    });
  });

  describe('completeAssignment', () => {
    it('should complete assignment', async () => {
      const mockObj = { id: 'assignment-1', status: 'COMPLETED' };
      mockService.completeAssignment.mockResolvedValue(mockObj);
      expect(await controller.completeAssignment('assignment-1')).toEqual(mockObj);
    });
  });

  describe('findOne', () => {
    it('should return an assignment by id', async () => {
      const mockObj = { id: 'assignment-1', task: 'Planting' };
      mockService.findOne.mockResolvedValue(mockObj);
      expect(await controller.findOne('assignment-1')).toEqual(mockObj);
    });
    it('should throw ResourceNotFoundException if not found', async () => {
      mockService.findOne.mockRejectedValue(new ResourceNotFoundException('Not found'));
      await expect(controller.findOne('assignment-404')).rejects.toThrow(ResourceNotFoundException);
    });
  });

  it.skip('should update assignment status', async () => {
    // Đã xóa method updateAssignmentStatus
  });
}); 