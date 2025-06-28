import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsModule } from './assignments.module';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';

describe('AssignmentsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AssignmentsModule],
    }).compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should have AssignmentsController', () => {
    const controller = module.get<AssignmentsController>(AssignmentsController);
    expect(controller).toBeInstanceOf(AssignmentsController);
  });

  it('should have AssignmentsService', () => {
    const service = module.get<AssignmentsService>(AssignmentsService);
    expect(service).toBeInstanceOf(AssignmentsService);
  });
}); 