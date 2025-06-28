import { Test, TestingModule } from '@nestjs/testing';
import { ZonesModule } from './zones.module';
import { ZonesController } from './zones.controller';
import { ZonesService } from './zones.service';

describe('ZonesModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ZonesModule],
    }).compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should have ZonesController', () => {
    const controller = module.get<ZonesController>(ZonesController);
    expect(controller).toBeInstanceOf(ZonesController);
  });

  it('should have ZonesService', () => {
    const service = module.get<ZonesService>(ZonesService);
    expect(service).toBeInstanceOf(ZonesService);
  });
}); 