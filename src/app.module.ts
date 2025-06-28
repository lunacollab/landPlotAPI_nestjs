import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ZonesModule } from './modules/zones/zones.module';
import { LandPlotsModule } from './modules/land-plots/land-plots.module';
import { CropsModule } from './modules/crops/crops.module';
import { ServicesModule } from './modules/services/services.module';
import { WorkersModule } from './modules/workers/workers.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { MapModule } from './modules/map/map.module';
import { ReportsModule } from './modules/reports/reports.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    ZonesModule,
    LandPlotsModule,
    CropsModule,
    ServicesModule,
    WorkersModule,
    AssignmentsModule,
    MapModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
