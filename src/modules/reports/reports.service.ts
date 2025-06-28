import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getLandUtilizationReport() {
    const [totalLandPlots, landPlotsByStatus, landPlotsByZone] = await Promise.all([
      this.prisma.landPlot.count(),
      this.prisma.landPlot.groupBy({
        by: ['status'],
        _count: {
          id: true,
        },
        _sum: {
          area: true,
        },
      }),
      this.prisma.landPlot.groupBy({
        by: ['zoneId'],
        _count: {
          id: true,
        },
        _sum: {
          area: true,
        },
      }),
    ]);

    const zones = await this.prisma.zone.findMany({
      select: {
        id: true,
        name: true,
        color: true,
      },
    });

    const zoneMap = new Map(zones.map(zone => [zone.id, zone]));

    return {
      summary: {
        totalLandPlots,
        totalArea: landPlotsByStatus.reduce((sum, item) => sum + (item._sum.area || 0), 0),
      },
      byStatus: landPlotsByStatus.map(item => ({
        status: item.status,
        count: item._count.id,
        area: item._sum.area || 0,
        percentage: ((item._count.id / totalLandPlots) * 100).toFixed(2),
      })),
      byZone: landPlotsByZone.map(item => {
        const zone = zoneMap.get(item.zoneId);
        return {
          zoneId: item.zoneId,
          zoneName: zone?.name || 'Unknown',
          zoneColor: zone?.color || '#000000',
          count: item._count.id,
          area: item._sum.area || 0,
        };
      }),
    };
  }

  async getCropYieldReport(startDate?: Date, endDate?: Date) {
    const whereClause: any = {};
    if (startDate && endDate) {
      whereClause.harvestDate = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [cropPlantings, cropsByCategory] = await Promise.all([
      this.prisma.cropPlanting.findMany({
        where: whereClause,
        include: {
          crop: true,
          landPlot: {
            include: {
              zone: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { harvestDate: 'desc' },
      }),
      this.prisma.cropPlanting.groupBy({
        by: ['cropId'],
        where: whereClause,
        _count: {
          id: true,
        },
        _sum: {
          actualYield: true,
        },
      }),
    ]);

    const crops = await this.prisma.crop.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        expectedYield: true,
      },
    });

    const cropMap = new Map(crops.map(crop => [crop.id, crop]));

    const yieldByCrop = cropsByCategory.map(item => {
      const crop = cropMap.get(item.cropId);
      return {
        cropId: item.cropId,
        cropName: crop?.name || 'Unknown',
        cropCategory: crop?.category || 'Unknown',
        plantingCount: item._count.id,
        totalYield: item._sum.actualYield || 0,
        averageYield: item._count.id > 0 ? (item._sum.actualYield || 0) / item._count.id : 0,
        expectedYield: crop?.expectedYield || 0,
      };
    });

    const totalYield = yieldByCrop.reduce((sum, item) => sum + item.totalYield, 0);

    return {
      summary: {
        totalPlantings: cropPlantings.length,
        totalYield,
        averageYield: cropPlantings.length > 0 ? totalYield / cropPlantings.length : 0,
      },
      byCrop: yieldByCrop,
      recentHarvests: cropPlantings.slice(0, 10).map(planting => ({
        id: planting.id,
        cropName: planting.crop.name,
        landPlotName: planting.landPlot.name,
        zoneName: planting.landPlot.zone.name,
        harvestDate: planting.harvestDate,
        actualYield: planting.actualYield,
        status: planting.status,
      })),
    };
  }

  async getWorkerPerformanceReport(startDate?: Date, endDate?: Date) {
    const whereClause: any = {};
    if (startDate && endDate) {
      whereClause.workDate = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [assignments, workersByStatus] = await Promise.all([
      this.prisma.workerAssignment.findMany({
        where: whereClause,
        include: {
          worker: {
            select: {
              id: true,
              name: true,
              email: true,
              status: true,
            },
          },
          landPlot: {
            include: {
              zone: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { workDate: 'desc' },
      }),
      this.prisma.workerAssignment.groupBy({
        by: ['workerId'],
        where: whereClause,
        _count: {
          id: true,
        },
        _sum: {
          hourlyRate: true,
        },
      }),
    ]);

    const workers = await this.prisma.user.findMany({
      where: { role: 'WORKER' },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
      },
    });

    const workerMap = new Map(workers.map(worker => [worker.id, worker]));

    const performanceByWorker = workersByStatus.map(item => {
      const worker = workerMap.get(item.workerId);
      const workerAssignments = assignments.filter(a => a.workerId === item.workerId);
      const completedAssignments = workerAssignments.filter(a => a.status === 'COMPLETED');
      const totalHours = workerAssignments.reduce((sum, a) => {
        const start = new Date(a.startTime);
        const end = new Date(a.endTime);
        return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }, 0);

      return {
        workerId: item.workerId,
        workerName: worker?.name || 'Unknown',
        workerEmail: worker?.email || 'Unknown',
        workerStatus: worker?.status || 'Unknown',
        totalAssignments: item._count.id,
        completedAssignments: completedAssignments.length,
        completionRate: item._count.id > 0 ? (completedAssignments.length / item._count.id) * 100 : 0,
        totalHours,
        averageHourlyRate: item._count.id > 0 ? (item._sum.hourlyRate || 0) / item._count.id : 0,
        totalEarnings: totalHours * (item._sum.hourlyRate || 0) / item._count.id,
      };
    });

    const totalWorkers = performanceByWorker.length;
    const totalAssignments = performanceByWorker.reduce((sum, w) => sum + w.totalAssignments, 0);
    const totalCompleted = performanceByWorker.reduce((sum, w) => sum + w.completedAssignments, 0);

    return {
      summary: {
        totalWorkers,
        totalAssignments,
        totalCompleted,
        overallCompletionRate: totalAssignments > 0 ? (totalCompleted / totalAssignments) * 100 : 0,
      },
      byWorker: performanceByWorker.sort((a, b) => b.completionRate - a.completionRate),
      topPerformers: performanceByWorker
        .sort((a, b) => b.completionRate - a.completionRate)
        .slice(0, 5),
    };
  }

  async getFinancialReport(startDate?: Date, endDate?: Date) {
    const whereClause: any = {};
    if (startDate && endDate) {
      whereClause.workDate = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [assignments, services] = await Promise.all([
      this.prisma.workerAssignment.findMany({
        where: whereClause,
        include: {
          worker: {
            select: {
              id: true,
              name: true,
            },
          },
          landPlot: {
            include: {
              zone: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.landService.findMany({
        where: {
          scheduledAt: startDate && endDate ? {
            gte: startDate,
            lte: endDate,
          } : undefined,
        },
        include: {
          service: true,
          landPlot: {
            include: {
              zone: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
    ]);

    // Calculate worker costs
    const workerCosts = assignments.reduce((sum, assignment) => {
      const start = new Date(assignment.startTime);
      const end = new Date(assignment.endTime);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return sum + (hours * assignment.hourlyRate);
    }, 0);

    // Calculate service costs
    const serviceCosts = services.reduce((sum, service) => sum + service.cost, 0);

    // Group by month
    const monthlyData = new Map();
    assignments.forEach(assignment => {
      const month = new Date(assignment.workDate).toISOString().slice(0, 7);
      if (!monthlyData.has(month)) {
        monthlyData.set(month, { workerCosts: 0, serviceCosts: 0, assignments: 0 });
      }
      const data = monthlyData.get(month);
      const start = new Date(assignment.startTime);
      const end = new Date(assignment.endTime);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      data.workerCosts += hours * assignment.hourlyRate;
      data.assignments += 1;
    });

    services.forEach(service => {
      const month = new Date(service.scheduledAt).toISOString().slice(0, 7);
      if (!monthlyData.has(month)) {
        monthlyData.set(month, { workerCosts: 0, serviceCosts: 0, assignments: 0 });
      }
      const data = monthlyData.get(month);
      data.serviceCosts += service.cost;
    });

    return {
      summary: {
        totalWorkerCosts: workerCosts,
        totalServiceCosts: serviceCosts,
        totalCosts: workerCosts + serviceCosts,
        totalAssignments: assignments.length,
        totalServices: services.length,
      },
      monthlyBreakdown: Array.from(monthlyData.entries()).map(([month, data]) => ({
        month,
        workerCosts: data.workerCosts,
        serviceCosts: data.serviceCosts,
        totalCosts: data.workerCosts + data.serviceCosts,
        assignments: data.assignments,
      })),
      byZone: assignments.reduce((acc, assignment) => {
        const zoneName = assignment.landPlot.zone.name;
        if (!acc[zoneName]) {
          acc[zoneName] = { costs: 0, assignments: 0 };
        }
        const start = new Date(assignment.startTime);
        const end = new Date(assignment.endTime);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        acc[zoneName].costs += hours * assignment.hourlyRate;
        acc[zoneName].assignments += 1;
        return acc;
      }, {}),
    };
  }
} 