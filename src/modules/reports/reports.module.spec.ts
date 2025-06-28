import { Test, TestingModule } from '@nestjs/testing';
import { ReportsModule } from './reports.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

describe('ReportsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ReportsModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have ReportsController', () => {
    const controller = module.get<ReportsController>(ReportsController);
    expect(controller).toBeInstanceOf(ReportsController);
  });

  it('should have ReportsService', () => {
    const service = module.get<ReportsService>(ReportsService);
    expect(service).toBeInstanceOf(ReportsService);
  });

  it('should export ReportsService', () => {
    const service = module.get<ReportsService>(ReportsService);
    expect(service).toBeDefined();
  });

  it('should have correct module structure', () => {
    const reportsModule = module.get(ReportsModule);
    expect(reportsModule).toBeDefined();
  });

  it('should export ReportsModule class', () => {
    expect(ReportsModule).toBeDefined();
    expect(typeof ReportsModule).toBe('function');
  });
}); 