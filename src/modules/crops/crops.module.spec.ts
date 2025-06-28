import { Test, TestingModule } from '@nestjs/testing';
import { CropsModule } from './crops.module';
import { CropsController } from './crops.controller';
import { CropsService } from './crops.service';

describe('CropsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CropsModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have CropsController', () => {
    const controller = module.get<CropsController>(CropsController);
    expect(controller).toBeInstanceOf(CropsController);
  });

  it('should have CropsService', () => {
    const service = module.get<CropsService>(CropsService);
    expect(service).toBeInstanceOf(CropsService);
  });

  it('should export CropsService', () => {
    const service = module.get<CropsService>(CropsService);
    expect(service).toBeDefined();
  });

  it('should have correct module structure', () => {
    const cropsModule = module.get(CropsModule);
    expect(cropsModule).toBeDefined();
  });

  it('should export CropsModule class', () => {
    expect(CropsModule).toBeDefined();
    expect(typeof CropsModule).toBe('function');
  });
}); 