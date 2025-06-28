import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ResourceNotFoundException } from '../../common/exceptions/custom.exception';

@Injectable()
export class MapService {
  constructor(private prisma: PrismaService) {}

  async getZoneMapData() {
    const zones = await this.prisma.zone.findMany({
      include: {
        landPlots: {
          include: {
            crops: {
              include: {
                crop: true,
              },
              where: {
                status: { in: ['PLANTED', 'GROWING'] },
              },
            },
            assignments: {
              include: {
                worker: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
              where: {
                status: { in: ['ASSIGNED', 'IN_PROGRESS'] },
              },
            },
            _count: {
              select: {
                crops: true,
                assignments: true,
              },
            },
          },
        },
        _count: {
          select: {
            landPlots: true,
          },
        },
      },
    });

    return zones.map(zone => ({
      id: zone.id,
      name: zone.name,
      color: zone.color,
      address: zone.address,
      coordinates: zone.coordinates,
      landPlots: zone.landPlots.map(plot => ({
        id: plot.id,
        name: plot.name,
        area: plot.area,
        status: plot.status,
        coordinates: plot.coordinates,
        imageUrl: plot.imageUrl,
        currentCrop: plot.crops[0]?.crop?.name || null,
        assignedWorker: plot.assignments[0]?.worker?.name || null,
        workerId: plot.assignments[0]?.worker?.id || null,
        cropCount: plot._count.crops,
        assignmentCount: plot._count.assignments,
      })),
      plotCount: zone._count.landPlots,
    }));
  }

  async getLandPlotCoordinates() {
    const landPlots = await this.prisma.landPlot.findMany({
      include: {
        zone: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        crops: {
          include: {
            crop: true,
          },
          where: {
            status: { in: ['PLANTED', 'GROWING'] },
          },
        },
        assignments: {
          include: {
            worker: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          where: {
            status: { in: ['ASSIGNED', 'IN_PROGRESS'] },
          },
        },
      },
    });

    return landPlots.map(plot => ({
      id: plot.id,
      name: plot.name,
      area: plot.area,
      status: plot.status,
      coordinates: plot.coordinates,
      zone: {
        id: plot.zone.id,
        name: plot.zone.name,
        color: plot.zone.color,
      },
      currentCrop: plot.crops[0]?.crop?.name || null,
      assignedWorker: plot.assignments[0]?.worker?.name || null,
      workerId: plot.assignments[0]?.worker?.id || null,
    }));
  }

  async getLandPlotHighlight(id: string) {
    const landPlot = await this.prisma.landPlot.findUnique({
      where: { id },
      include: {
        zone: {
          select: {
            id: true,
            name: true,
            color: true,
            address: true,
          },
        },
        crops: {
          include: {
            crop: true,
          },
          where: {
            status: { in: ['PLANTED', 'GROWING'] },
          },
        },
        assignments: {
          include: {
            worker: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
          where: {
            status: { in: ['ASSIGNED', 'IN_PROGRESS'] },
          },
        },
        services: {
          include: {
            service: true,
            worker: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          where: {
            status: { in: ['PENDING', 'IN_PROGRESS'] },
          },
        },
        _count: {
          select: {
            crops: true,
            assignments: true,
            services: true,
          },
        },
      },
    });

    if (!landPlot) {
      throw new ResourceNotFoundException('Land Plot', id);
    }

    return {
      id: landPlot.id,
      name: landPlot.name,
      area: landPlot.area,
      status: landPlot.status,
      coordinates: landPlot.coordinates,
      imageUrl: landPlot.imageUrl,
      soilType: landPlot.soilType,
      notes: landPlot.notes,
      lastSeasonCrop: landPlot.lastSeasonCrop,
      zone: {
        id: landPlot.zone.id,
        name: landPlot.zone.name,
        color: landPlot.zone.color,
        address: landPlot.zone.address,
      },
      currentCrop: landPlot.crops[0]?.crop?.name || null,
      assignedWorker: landPlot.assignments[0]?.worker?.name || null,
      workerId: landPlot.assignments[0]?.worker?.id || null,
      workerContact: landPlot.assignments[0]?.worker ? {
        email: landPlot.assignments[0].worker.email,
        phone: landPlot.assignments[0].worker.phone,
      } : null,
      activeServices: landPlot.services.map(service => ({
        id: service.id,
        name: service.service.name,
        status: service.status,
        scheduledAt: service.scheduledAt,
        worker: service.worker?.name || null,
      })),
      statistics: {
        cropCount: landPlot._count.crops,
        assignmentCount: landPlot._count.assignments,
        serviceCount: landPlot._count.services,
      },
    };
  }

  async getMapOverview() {
    const [zones, landPlots, workers] = await Promise.all([
      this.prisma.zone.count(),
      this.prisma.landPlot.count(),
      this.prisma.user.count({
        where: { role: 'WORKER' },
      }),
    ]);

    const landPlotStatuses = await this.prisma.landPlot.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    const activeAssignments = await this.prisma.workerAssignment.count({
      where: {
        status: { in: ['ASSIGNED', 'IN_PROGRESS'] },
      },
    });

    return {
      summary: {
        totalZones: zones,
        totalLandPlots: landPlots,
        totalWorkers: workers,
        activeAssignments,
      },
      landPlotStatuses: landPlotStatuses.map(item => ({
        status: item.status,
        count: item._count.id,
      })),
    };
  }

  async getZoneDetails(zoneId: string) {
    const zone = await this.prisma.zone.findUnique({
      where: { id: zoneId },
      include: {
        landPlots: {
          include: {
            crops: {
              include: {
                crop: true,
              },
              where: {
                status: { in: ['PLANTED', 'GROWING'] },
              },
            },
            assignments: {
              include: {
                worker: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
              where: {
                status: { in: ['ASSIGNED', 'IN_PROGRESS'] },
              },
            },
            services: {
              include: {
                service: true,
              },
              where: {
                status: { in: ['PENDING', 'IN_PROGRESS'] },
              },
            },
            _count: {
              select: {
                crops: true,
                assignments: true,
                services: true,
              },
            },
          },
        },
        _count: {
          select: {
            landPlots: true,
          },
        },
      },
    });

    if (!zone) {
      throw new ResourceNotFoundException('Zone', zoneId);
    }

    return {
      id: zone.id,
      name: zone.name,
      color: zone.color,
      address: zone.address,
      coordinates: zone.coordinates,
      landPlots: zone.landPlots.map(plot => ({
        id: plot.id,
        name: plot.name,
        area: plot.area,
        status: plot.status,
        coordinates: plot.coordinates,
        currentCrop: plot.crops[0]?.crop?.name || null,
        assignedWorker: plot.assignments[0]?.worker?.name || null,
        activeServices: plot.services.map(service => ({
          id: service.id,
          name: service.service.name,
          status: service.status,
        })),
        statistics: {
          cropCount: plot._count.crops,
          assignmentCount: plot._count.assignments,
          serviceCount: plot._count.services,
        },
      })),
      totalPlots: zone._count.landPlots,
      totalArea: zone.landPlots.reduce((sum, plot) => sum + plot.area, 0),
    };
  }
} 