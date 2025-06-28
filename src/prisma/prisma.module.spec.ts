import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { PrismaModule } from './prisma.module';
import { PrismaService } from './prisma.service';

describe('PrismaModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule],
    }).compile();

    expect(module).toBeDefined();
  });

  it('should provide PrismaService', async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule],
    }).compile();

    const prismaService = module.get<PrismaService>(PrismaService);
    expect(prismaService).toBeInstanceOf(PrismaService);
  });

  it('should export PrismaService', async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule],
    }).compile();

    const prismaService = module.get<PrismaService>(PrismaService);
    expect(prismaService).toBeDefined();
  });

  it('should have correct module structure', () => {
    const moduleMetadata = Reflect.getMetadata('imports', PrismaModule);
    const providers = Reflect.getMetadata('providers', PrismaModule);
    const exports = Reflect.getMetadata('exports', PrismaModule);

    expect(providers).toContain(PrismaService);
    expect(exports).toContain(PrismaService);
  });
}); 