import { Test, TestingModule } from '@nestjs/testing';
import { ServicesModule } from './services.module';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

describe('ServicesModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ServicesModule],
    }).compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should have ServicesController', () => {
    const controller = module.get<ServicesController>(ServicesController);
    expect(controller).toBeInstanceOf(ServicesController);
  });

  it('should have ServicesService', () => {
    const service = module.get<ServicesService>(ServicesService);
    expect(service).toBeInstanceOf(ServicesService);
  });
}); 