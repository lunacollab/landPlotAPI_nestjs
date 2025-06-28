import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have AppController', () => {
    const controller = module.get<AppController>(AppController);
    expect(controller).toBeInstanceOf(AppController);
  });

  it('should have AppService', () => {
    const service = module.get<AppService>(AppService);
    expect(service).toBeInstanceOf(AppService);
  });

  it('should have correct module structure', () => {
    const appModule = module.get(AppModule);
    expect(appModule).toBeDefined();
  });

  it('should export AppModule class', () => {
    expect(AppModule).toBeDefined();
    expect(typeof AppModule).toBe('function');
  });
}); 