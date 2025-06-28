import { Test, TestingModule } from '@nestjs/testing';
import { WorkersModule } from './workers.module';
import { WorkersController } from './workers.controller';
import { WorkersService } from './workers.service';

describe('WorkersModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [WorkersModule],
    }).compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should have WorkersController', () => {
    const controller = module.get<WorkersController>(WorkersController);
    expect(controller).toBeInstanceOf(WorkersController);
  });

  it('should have WorkersService', () => {
    const service = module.get<WorkersService>(WorkersService);
    expect(service).toBeInstanceOf(WorkersService);
  });
}); 