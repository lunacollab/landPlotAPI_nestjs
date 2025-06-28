import { Test, TestingModule } from '@nestjs/testing';
import { LandPlotsModule } from './land-plots.module';
import { LandPlotsController } from './land-plots.controller';
import { LandPlotsService } from './land-plots.service';

describe('LandPlotsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [LandPlotsModule],
    }).compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should have LandPlotsController', () => {
    const controller = module.get<LandPlotsController>(LandPlotsController);
    expect(controller).toBeInstanceOf(LandPlotsController);
  });

  it('should have LandPlotsService', () => {
    const service = module.get<LandPlotsService>(LandPlotsService);
    expect(service).toBeInstanceOf(LandPlotsService);
  });
}); 