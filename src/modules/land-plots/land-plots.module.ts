import { Module } from '@nestjs/common';
import { LandPlotsService } from './land-plots.service';
import { LandPlotsController } from './land-plots.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LandPlotsController],
  providers: [LandPlotsService],
  exports: [LandPlotsService],
})
export class LandPlotsModule {} 