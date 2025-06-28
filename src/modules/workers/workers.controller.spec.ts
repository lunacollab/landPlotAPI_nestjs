import { Test, TestingModule } from '@nestjs/testing';
import { WorkersController } from './workers.controller';
import { WorkersService } from './workers.service';
import { CreateWorkerDto, UpdateWorkerDto } from './dto/worker.dto';
import { ResourceNotFoundException } from '../../common/exceptions/custom.exception';

describe('WorkersController', () => {
  let controller: WorkersController;
  let service: WorkersService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getWorkerAssignments: jest.fn(),
    getWorkerSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkersController],
      providers: [
        {
          provide: WorkersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<WorkersController>(WorkersController);
    service = module.get<WorkersService>(WorkersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all workers', async () => {
      const mockArr = [
        { id: 'worker-1', name: 'John' },
        { id: 'worker-2', name: 'Jane' },
      ];
      mockService.findAll.mockResolvedValue(mockArr);
      expect(await controller.findAll({}, {})).toEqual(mockArr);
    });
  });

  describe('findOne', () => {
    it('should return a worker by id', async () => {
      const mockObj = { id: 'worker-1', name: 'John' };
      mockService.findOne.mockResolvedValue(mockObj);
      expect(await controller.findOne('worker-1')).toEqual(mockObj);
    });
    it('should throw ResourceNotFoundException if not found', async () => {
      mockService.findOne.mockRejectedValue(new ResourceNotFoundException('Not found'));
      await expect(controller.findOne('worker-404')).rejects.toThrow(ResourceNotFoundException);
    });
  });

  describe('update', () => {
    it('should update a worker', async () => {
      const dto: UpdateWorkerDto = { name: 'John Updated' };
      const mockObj = { id: 'worker-1', ...dto };
      mockService.update.mockResolvedValue(mockObj);
      expect(await controller.update('worker-1', dto)).toEqual(mockObj);
    });
  });

  describe('remove', () => {
    it('should remove a worker', async () => {
      mockService.remove.mockResolvedValue({ id: 'worker-1' });
      expect(await controller.remove('worker-1')).toEqual({ id: 'worker-1' });
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

  describe('getWorkerSchedule', () => {
    it('should return worker schedule', async () => {
      const mockSchedule = { id: 'schedule-1', workDate: new Date(), tasks: [] };
      mockService.getWorkerSchedule.mockResolvedValue(mockSchedule);
      const date = new Date('2024-01-15');
      expect(await controller.getWorkerSchedule('worker-1', date)).toEqual(mockSchedule);
    });
  });

  describe('register', () => {
    it.skip('should register user', async () => {
      // Đã xóa chức năng tạo worker qua API
    });
  });
}); 