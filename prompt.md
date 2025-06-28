# Farm Management System - NestJS Development Prompt

## Project Overview
Develop a comprehensive Farm Management System using **NestJS + Prisma + MySQL** with full test coverage and HTML coverage reports.

## Tech Stack Requirements
- **Backend**: NestJS (TypeScript)
- **Database**: MySQL with Prisma ORM
- **Testing**: Jest with coverage reports
- **Authentication**: JWT-based auth with role-based access
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator, class-transformer
- **File Upload**: Multer for image handling

## Database Schema (Prisma)

### Core Models
```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  phone       String?
  name        String
  role        Role     @default(WORKER)
  status      UserStatus @default(WORKING)
  expertise   Json?    // Professional skills and pricing
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  assignments WorkerAssignment[]
  schedules   WorkSchedule[]
  
  @@map("users")
}

model Zone {
  id          String     @id @default(cuid())
  name        String     // A, B, C, D
  color       String     // Hex color for map display
  address     String?
  coordinates Json?      // GPS coordinates
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  // Relations
  landPlots   LandPlot[]
  
  @@map("zones")
}

model LandPlot {
  id              String        @id @default(cuid())
  name            String
  soilType        String
  area            Float         // Square meters
  coordinates     Json?         // GPS coordinates
  status          LandStatus    @default(EMPTY)
  notes           String?
  lastSeasonCrop  String?       // Previous crop history
  imageUrl        String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  // Foreign Keys
  zoneId          String
  zone            Zone          @relation(fields: [zoneId], references: [id])
  
  // Relations
  crops           CropPlanting[]
  services        LandService[]
  schedules       PlantingSchedule[]
  assignments     WorkerAssignment[]
  
  @@map("land_plots")
}

model Crop {
  id                    String       @id @default(cuid())
  name                  String
  category              CropCategory
  varietyCount          Int          @default(1)
  daysToHarvest         Int          // Days from germination to harvest
  suggestedPlantingTime Json?        // Seasonal recommendations
  expectedYield         Float?       // Expected yield per sq meter
  status                CropStatus   @default(ACTIVE)
  careHistory           Json?        // Previous season care history
  createdAt             DateTime     @default(now())
  updatedAt             DateTime     @updatedAt
  
  // Relations
  plantings             CropPlanting[]
  
  @@map("crops")
}

model CropPlanting {
  id           String         @id @default(cuid())
  plantingDate DateTime
  harvestDate  DateTime?
  actualYield  Float?
  status       PlantingStatus @default(PLANNED)
  notes        String?
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
  
  // Foreign Keys
  cropId       String
  landPlotId   String
  
  // Relations
  crop         Crop           @relation(fields: [cropId], references: [id])
  landPlot     LandPlot       @relation(fields: [landPlotId], references: [id])
  
  @@map("crop_plantings")
}

model Service {
  id          String    @id @default(cuid())
  code        String    @unique
  name        String
  costPerSqm  Float     // Cost per square meter
  duration    Int       // Duration in hours
  status      ServiceStatus @default(ACTIVE)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  landServices LandService[]
  
  @@map("services")
}

model LandService {
  id          String        @id @default(cuid())
  scheduledAt DateTime
  completedAt DateTime?
  duration    Int           // Actual duration in hours
  cost        Float
  status      ServiceStatus @default(PENDING)
  notes       String?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  // Foreign Keys
  serviceId   String
  landPlotId  String
  workerId    String?
  
  // Relations
  service     Service       @relation(fields: [serviceId], references: [id])
  landPlot    LandPlot      @relation(fields: [landPlotId], references: [id])
  worker      User?         @relation(fields: [workerId], references: [id])
  
  @@map("land_services")
}

model PlantingSchedule {
  id            String          @id @default(cuid())
  season        String          // "2024-Q1", "2024-Q2", etc.
  status        ScheduleStatus  @default(LOCKED)
  cropType      String?
  plannedServices Json?         // Array of planned services
  lockedUntil   DateTime?       // Lock release date (30 days before season)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  
  // Foreign Keys
  landPlotId    String
  
  // Relations
  landPlot      LandPlot        @relation(fields: [landPlotId], references: [id])
  
  @@map("planting_schedules")
}

model WorkerAssignment {
  id          String    @id @default(cuid())
  workDate    DateTime
  startTime   DateTime
  endTime     DateTime
  hourlyRate  Float
  task        String
  status      WorkStatus @default(ASSIGNED)
  landArea    Float
  cropType    String?
  paymentStatus PaymentStatus @default(PENDING)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Foreign Keys
  workerId    String
  landPlotId  String
  
  // Relations
  worker      User      @relation(fields: [workerId], references: [id])
  landPlot    LandPlot  @relation(fields: [landPlotId], references: [id])
  
  @@map("worker_assignments")
}

model WorkSchedule {
  id          String    @id @default(cuid())
  workDate    DateTime
  tasks       Json      // Array of tasks for the day
  totalHours  Float
  totalPay    Float
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Foreign Keys
  workerId    String
  
  // Relations
  worker      User      @relation(fields: [workerId], references: [id])
  
  @@map("work_schedules")
}

// Enums
enum Role {
  FARM_OWNER
  WORKER
}

enum UserStatus {
  WORKING
  RESTING
  OTHER
}

enum LandStatus {
  EMPTY
  IN_USE
  RENOVATING
  LOCKED
}

enum CropCategory {
  FRUIT
  VEGETABLE
  ROOT_VEGETABLE
  HERB_SPICE
}

enum CropStatus {
  ACTIVE
  INACTIVE
}

enum PlantingStatus {
  PLANNED
  PLANTED
  GROWING
  HARVESTED
}

enum ServiceStatus {
  ACTIVE
  INACTIVE
  PENDING
  IN_PROGRESS
  COMPLETED
}

enum ScheduleStatus {
  LOCKED
  OPEN
}

enum WorkStatus {
  ASSIGNED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PAID
  CANCELLED
}
```

## API Requirements

### 1. Authentication & Authorization
```typescript
// Auth endpoints
POST /auth/login
POST /auth/register
POST /auth/refresh
POST /auth/logout
GET  /auth/profile

// Role-based access:
// FARM_OWNER: Full access to all resources
// WORKER: Read access to assignments, update work status
```

### 2. Zone Management
```typescript
GET    /zones                    // List all zones
POST   /zones                    // Create zone
GET    /zones/:id                // Get zone details
PUT    /zones/:id                // Update zone
DELETE /zones/:id                // Delete zone
GET    /zones/:id/land-plots     // Get land plots in zone
```

### 3. Land Plot Management
```typescript
GET    /land-plots               // List with filters (zone, status, etc.)
POST   /land-plots               // Create land plot
GET    /land-plots/:id           // Get land plot details
PUT    /land-plots/:id           // Update land plot
DELETE /land-plots/:id           // Delete land plot
POST   /land-plots/:id/images    // Upload land plot images
GET    /land-plots/:id/history   // Get usage history
GET    /land-plots/:id/schedule  // Get planting schedule
```

### 4. Crop Management
```typescript
GET    /crops                    // List all crops
POST   /crops                    // Create crop
GET    /crops/:id                // Get crop details
PUT    /crops/:id                // Update crop
DELETE /crops/:id                // Delete crop
GET    /crops/categories         // Get crop categories
```

### 5. Service Management
```typescript
GET    /services                 // List all services
POST   /services                 // Create service
GET    /services/:id             // Get service details
PUT    /services/:id             // Update service
DELETE /services/:id             // Delete service
```

### 6. Worker Management
```typescript
GET    /workers                  // List all workers
POST   /workers                  // Create worker
GET    /workers/:id              // Get worker details
PUT    /workers/:id              // Update worker
DELETE /workers/:id              // Delete worker
GET    /workers/:id/assignments  // Get worker assignments
GET    /workers/:id/schedule     // Get worker calendar
```

### 7. Schedule Management
```typescript
GET    /schedules                // Get schedules (weekly/monthly view)
POST   /schedules                // Create/update schedule
PUT    /schedules/:id            // Update schedule
DELETE /schedules/:id            // Delete schedule
GET    /schedules/calendar       // Calendar view with filters
POST   /schedules/submit         // Submit locked schedules
```

### 8. Assignment Management
```typescript
GET    /assignments              // List assignments
POST   /assignments              // Create assignment
PUT    /assignments/:id/status   // Update assignment status
GET    /assignments/worker/:id   // Get worker's assignments
POST   /assignments/:id/start    // Mark assignment as started
POST   /assignments/:id/complete // Mark assignment as completed
```

### 9. Map & Location
```typescript
GET    /map/zones                // Get zone map data
GET    /map/land-plots           // Get land plot coordinates
GET    /map/land-plots/:id       // Highlight specific land plot
```

### 10. Reports & Analytics
```typescript
GET    /reports/land-utilization // Land usage statistics
GET    /reports/crop-yield       // Crop yield reports
GET    /reports/worker-performance // Worker performance metrics
GET    /reports/financial        // Financial reports
```

## Project Structure
```
src/
├── app.module.ts
├── main.ts
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── app.config.ts
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   ├── guards/
│   │   └── strategies/
│   ├── zones/
│   │   ├── zones.controller.ts
│   │   ├── zones.service.ts
│   │   ├── zones.module.ts
│   │   ├── dto/
│   │   └── entities/
│   ├── land-plots/
│   ├── crops/
│   ├── services/
│   ├── workers/
│   ├── schedules/
│   ├── assignments/
│   ├── map/
│   └── reports/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
└── test/
    ├── unit/
    ├── integration/
    └── e2e/
```

## Testing Requirements

### Test Configuration
```json
// package.json - scripts section
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "test:e2e:cov": "jest --config ./test/jest-e2e.json --coverage"
  }
}
```

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.spec.ts',
    '!**/*.interface.ts',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  coverageDirectory: '../coverage',
  coverageReporters: ['html', 'text', 'lcov', 'clover'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/../test/setup.ts'],
};
```

### Test Coverage Requirements
- **Unit Tests**: 90%+ coverage for services and controllers
- **Integration Tests**: Database operations and API endpoints
- **E2E Tests**: Complete user workflows
- **Coverage Report**: Generate HTML report in `coverage/lcov-report/index.html`

### Sample Test Structure
```typescript
// Example: land-plots.service.spec.ts
describe('LandPlotsService', () => {
  let service: LandPlotsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LandPlotsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<LandPlotsService>(LandPlotsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('createLandPlot', () => {
    it('should create a new land plot', async () => {
      // Test implementation
    });

    it('should throw error if zone not exists', async () => {
      // Test implementation
    });
  });

  describe('updateLandPlotStatus', () => {
    it('should update land plot status', async () => {
      // Test implementation
    });
  });
});
```

## Key Features Implementation

### 1. Schedule Lock/Unlock System
```typescript
// Implement automatic schedule unlocking 30 days before season
@Cron('0 0 * * *') // Daily check
async checkScheduleLocks() {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  await this.prisma.plantingSchedule.updateMany({
    where: {
      status: 'LOCKED',
      lockedUntil: {
        lte: new Date(),
      },
    },
    data: {
      status: 'OPEN',
    },
  });
}
```

### 2. Email Notifications
```typescript
// Email service for schedule notifications
@Injectable()
export class EmailService {
  async sendScheduleNotification(workerId: string, assignments: WorkerAssignment[]) {
    // Implement email sending logic
  }
}
```

### 3. Payment System
```typescript
// Auto-payment after 24 hours
@Cron('0 */6 * * *') // Every 6 hours
async processAutomaticPayments() {
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
  
  // Auto-pay completed assignments after 24 hours
}
```

### 4. Map Integration
```typescript
// Map controller for zone and land plot visualization
@Controller('map')
export class MapController {
  @Get('zones')
  async getZoneMapData() {
    return this.mapService.getZonesWithCoordinates();
  }

  @Get('land-plots/:id/highlight')
  async highlightLandPlot(@Param('id') id: string) {
    return this.mapService.getLandPlotHighlight(id);
  }
}
```

## Development Checklist

### Phase 1: Setup & Core Models
- [ ] NestJS project initialization
- [ ] Prisma schema setup
- [ ] Database connection
- [ ] JWT authentication
- [ ] Basic CRUD operations
- [ ] Unit tests setup

### Phase 2: Business Logic
- [ ] Schedule management system
- [ ] Worker assignment logic
- [ ] Lock/unlock mechanisms
- [ ] Email notifications
- [ ] File upload functionality

### Phase 3: Advanced Features
- [ ] Map integration
- [ ] Calendar views (weekly/monthly)
- [ ] Payment processing
- [ ] Reporting system
- [ ] Integration tests

### Phase 4: Testing & Documentation
- [ ] Complete test coverage
- [ ] HTML coverage reports
- [ ] API documentation (Swagger)
- [ ] Performance optimization
- [ ] Security auditing

## Performance & Security

### Database Optimization
```sql
-- Essential indexes
CREATE INDEX idx_land_plots_zone_id ON land_plots(zone_id);
CREATE INDEX idx_land_plots_status ON land_plots(status);
CREATE INDEX idx_worker_assignments_worker_id ON worker_assignments(worker_id);
CREATE INDEX idx_worker_assignments_work_date ON worker_assignments(work_date);
```

### Security Measures
- Input validation with class-validator
- SQL injection prevention with Prisma
- JWT token expiration and refresh
- Role-based access control
- File upload validation
- Rate limiting

## Environment Configuration
```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/farm_management"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1d"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_REFRESH_EXPIRES_IN="7d"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# File Upload
MAX_FILE_SIZE=5242880 # 5MB
UPLOAD_PATH="./uploads"
```

This comprehensive prompt covers all the requirements from your document with proper NestJS architecture, Prisma integration, and complete test coverage setup.