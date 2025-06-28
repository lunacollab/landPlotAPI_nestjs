import { Test, TestingModule } from '@nestjs/testing';
import { MapModule } from './map.module';
import { MapController } from './map.controller';
import { MapService } from './map.service';

describe('MapModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [MapModule],
    }).compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should have MapController', () => {
    const controller = module.get<MapController>(MapController);
    expect(controller).toBeInstanceOf(MapController);
  });

  it('should have MapService', () => {
    const service = module.get<MapService>(MapService);
    expect(service).toBeInstanceOf(MapService);
  });
}); 