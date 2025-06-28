import { Test, TestingModule } from "@nestjs/testing";
import { ReportsService } from "./reports.service";
import { PrismaService } from "../../prisma/prisma.service";
import { LandStatus, UserStatus, Role, WorkStatus, PaymentStatus, PlantingStatus, ServiceStatus, CropStatus, CropCategory } from "@prisma/client";

describe("ReportsService", () => {
  let service: ReportsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: PrismaService,
          useValue: {
            landPlot: {
              findMany: jest.fn(),
              count: jest.fn(),
              groupBy: jest.fn(),
            },
            workerAssignment: {
              findMany: jest.fn(),
              count: jest.fn(),
              groupBy: jest.fn(),
            },
            user: {
              findMany: jest.fn(),
              count: jest.fn(),
            },
            cropPlanting: {
              findMany: jest.fn(),
              count: jest.fn(),
              groupBy: jest.fn(),
            },
            landService: {
              findMany: jest.fn(),
              count: jest.fn(),
            },
            zone: {
              findMany: jest.fn(),
            },
            crop: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getLandUtilizationReport", () => {
    it("should return land utilization report", async () => {
      const mockZones = [
        {
          id: "zone-1",
          name: "Zone A",
          coordinates: { lat: 10.762622, lng: 106.660172 },
          color: "#FF5733",
          address: "Test Address",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      jest.spyOn(prisma.landPlot, "count").mockResolvedValue(1);
      jest.spyOn(prisma.landPlot, "groupBy").mockResolvedValue([
        {
          status: LandStatus.EMPTY,
          _count: { id: 1 },
          _sum: { area: 100.0 },
          _avg: { area: 100.0 },
          _max: { area: 100.0 },
          _min: { area: 100.0 }
        } as any
      ]);
      jest.spyOn(prisma.zone, "findMany").mockResolvedValue(mockZones);

      const result = await service.getLandUtilizationReport();

      expect(prisma.landPlot.count).toHaveBeenCalled();
      expect(prisma.landPlot.groupBy).toHaveBeenCalled();
      expect(prisma.zone.findMany).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe("getWorkerPerformanceReport", () => {
    it("should return worker performance report", async () => {
      const mockWorkers = [
        {
          id: "worker-1",
          name: "John Doe",
          email: "john@example.com",
          phone: "+1234567890",
          password: "hashedpassword",
          role: Role.WORKER,
          status: UserStatus.WORKING,
          expertise: { skills: ["plowing", "planting"] },
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const mockAssignments = [
        {
          id: "assignment-1",
          workDate: new Date(),
          startTime: new Date(),
          endTime: new Date(),
          hourlyRate: 15.0,
          task: "Soil preparation",
          landArea: 100.0,
          cropType: "Tomato",
          status: WorkStatus.ASSIGNED,
          paymentStatus: PaymentStatus.PENDING,
          workerId: "worker-1",
          landPlotId: "plot-1",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      jest.spyOn(prisma.workerAssignment, "findMany").mockResolvedValue(mockAssignments);
      jest.spyOn(prisma.workerAssignment, "groupBy").mockResolvedValue([
        {
          workerId: "worker-1",
          _count: { id: 1 },
          _sum: { hourlyRate: 15.0 },
          _avg: { hourlyRate: 15.0 },
          _max: { hourlyRate: 15.0 },
          _min: { hourlyRate: 15.0 }
        } as any
      ]);
      jest.spyOn(prisma.user, "findMany").mockResolvedValue(mockWorkers);

      const result = await service.getWorkerPerformanceReport();

      expect(prisma.workerAssignment.findMany).toHaveBeenCalled();
      expect(prisma.workerAssignment.groupBy).toHaveBeenCalled();
      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe("getCropYieldReport", () => {
    it("should return crop yield report", async () => {
      const mockPlantings = [
        {
          id: "planting-1",
          plantingDate: new Date(),
          harvestDate: new Date(),
          actualYield: 4.5,
          status: PlantingStatus.HARVESTED,
          notes: "Good harvest",
          cropId: "crop-1",
          landPlotId: "plot-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          crop: {
            id: "crop-1",
            name: "Tomato",
            category: CropCategory.VEGETABLE,
            varietyCount: 1,
            daysToHarvest: 90,
            suggestedPlantingTime: { months: ["March", "April"] },
            expectedYield: 5.0,
            status: CropStatus.ACTIVE,
            careHistory: null,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          landPlot: {
            id: "plot-1",
            name: "Plot A",
            soilType: "Loamy",
            area: 100.0,
            status: LandStatus.EMPTY,
            coordinates: { lat: 10.762622, lng: 106.660172 },
            zoneId: "zone-1",
            notes: null,
            lastSeasonCrop: null,
            imageUrl: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            zone: {
              id: "zone-1",
              name: "Zone A",
              coordinates: { lat: 10.762622, lng: 106.660172 },
              color: "#FF5733",
              address: "Test Address",
              createdAt: new Date(),
              updatedAt: new Date()
            }
          }
        }
      ];

      const mockCrops = [
        {
          id: "crop-1",
          name: "Tomato",
          category: CropCategory.VEGETABLE,
          varietyCount: 1,
          daysToHarvest: 90,
          suggestedPlantingTime: { months: ["March", "April"] },
          expectedYield: 5.0,
          status: CropStatus.ACTIVE,
          careHistory: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      jest.spyOn(prisma.cropPlanting, "findMany").mockResolvedValue(mockPlantings);
      jest.spyOn(prisma.cropPlanting, "groupBy").mockResolvedValue([
        {
          cropId: "crop-1",
          _count: { id: 1 },
          _sum: { actualYield: 4.5 },
          _avg: { actualYield: 4.5 },
          _max: { actualYield: 4.5 },
          _min: { actualYield: 4.5 }
        } as any
      ]);
      jest.spyOn(prisma.crop, "findMany").mockResolvedValue(mockCrops);

      const result = await service.getCropYieldReport();

      expect(prisma.cropPlanting.findMany).toHaveBeenCalled();
      expect(prisma.cropPlanting.groupBy).toHaveBeenCalled();
      expect(prisma.crop.findMany).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe("getFinancialReport", () => {
    it("should return financial report", async () => {
      const mockServices = [
        {
          id: "service-1",
          scheduledAt: new Date(),
          completedAt: new Date(),
          duration: 4,
          cost: 100.0,
          status: ServiceStatus.COMPLETED,
          notes: "Service completed successfully",
          serviceId: "service-1",
          landPlotId: "plot-1",
          workerId: "worker-1",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const mockAssignments = [
        {
          id: "assignment-1",
          workDate: new Date(),
          startTime: new Date(),
          endTime: new Date(),
          hourlyRate: 15.0,
          task: "Soil preparation",
          landArea: 100.0,
          cropType: "Tomato",
          status: WorkStatus.COMPLETED,
          paymentStatus: PaymentStatus.PAID,
          workerId: "worker-1",
          landPlotId: "plot-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          worker: {
            id: "worker-1",
            name: "John Doe"
          },
          landPlot: {
            id: "plot-1",
            name: "Plot A",
            soilType: "Loamy",
            area: 100.0,
            status: LandStatus.EMPTY,
            coordinates: { lat: 10.762622, lng: 106.660172 },
            zoneId: "zone-1",
            notes: null,
            lastSeasonCrop: null,
            imageUrl: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            zone: {
              id: "zone-1",
              name: "Zone A",
              coordinates: { lat: 10.762622, lng: 106.660172 },
              color: "#FF5733",
              address: "Test Address",
              createdAt: new Date(),
              updatedAt: new Date()
            }
          }
        }
      ];

      jest.spyOn(prisma.workerAssignment, "findMany").mockResolvedValue(mockAssignments);
      jest.spyOn(prisma.landService, "findMany").mockResolvedValue(mockServices);

      const result = await service.getFinancialReport();

      expect(prisma.workerAssignment.findMany).toHaveBeenCalled();
      expect(prisma.landService.findMany).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});