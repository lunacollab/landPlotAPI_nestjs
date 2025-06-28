import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

describe('ReportsController', () => {
  let controller: ReportsController;
  let service: ReportsService;

  const mockService = {
    getLandUtilizationReport: jest.fn(),
    getCropYieldReport: jest.fn(),
    getWorkerPerformanceReport: jest.fn(),
    getFinancialReport: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    service = module.get<ReportsService>(ReportsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLandUtilizationReport', () => {
    it('should return land utilization report', async () => {
      const mockReport = { totalPlots: 12, utilizedPlots: 8, utilizationRate: 66.67 };
      mockService.getLandUtilizationReport.mockResolvedValue(mockReport);
      expect(await controller.getLandUtilizationReport()).toEqual(mockReport);
    });
  });

  describe('getCropYieldReport', () => {
    it('should return crop yield report', async () => {
      const mockReport = { crops: [{ name: 'Tomato', yield: 100 }] };
      mockService.getCropYieldReport.mockResolvedValue(mockReport);
      expect(await controller.getCropYieldReport()).toEqual(mockReport);
    });
  });

  describe('getWorkerPerformanceReport', () => {
    it('should return worker performance report', async () => {
      const mockReport = { workers: [{ name: 'John', completedTasks: 10 }] };
      mockService.getWorkerPerformanceReport.mockResolvedValue(mockReport);
      expect(await controller.getWorkerPerformanceReport()).toEqual(mockReport);
    });
  });

  describe('getFinancialReport', () => {
    it('should return financial report', async () => {
      const mockReport = { totalRevenue: 10000, totalCost: 5000, profit: 5000 };
      mockService.getFinancialReport.mockResolvedValue(mockReport);
      expect(await controller.getFinancialReport()).toEqual(mockReport);
    });
  });
}); 