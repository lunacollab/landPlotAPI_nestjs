import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create farm owner
  const farmOwnerPassword = await bcrypt.hash('farmowner123', 10);
  const farmOwner = await prisma.user.upsert({
    where: { email: 'farmowner@example.com' },
    update: {},
    create: {
      email: 'farmowner@example.com',
      name: 'Farm Owner',
      password: farmOwnerPassword,
      role: 'FARM_OWNER',
      phone: '+1234567890',
    },
  });

  // Create workers
  const workerPassword = await bcrypt.hash('worker123', 10);
  const workers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'worker1@example.com' },
      update: {},
      create: {
        email: 'worker1@example.com',
        name: 'Worker 1',
        password: workerPassword,
        role: 'WORKER',
        phone: '+1234567891',
        expertise: {
          skills: ['Soil Preparation', 'Planting', 'Watering'],
          hourlyRate: 15,
        },
      },
    }),
    prisma.user.upsert({
      where: { email: 'worker2@example.com' },
      update: {},
      create: {
        email: 'worker2@example.com',
        name: 'Worker 2',
        password: workerPassword,
        role: 'WORKER',
        phone: '+1234567892',
        expertise: {
          skills: ['Pesticide Application', 'Fertilizing', 'Harvesting'],
          hourlyRate: 18,
        },
      },
    }),
  ]);

  // Create zones
  const zones = await Promise.all([
    prisma.zone.upsert({
      where: { id: 'zone-a' },
      update: {},
      create: {
        id: 'zone-a',
        name: 'A',
        color: '#FF5733',
        address: 'Zone A - North Area',
        coordinates: { lat: 10.762622, lng: 106.660172 },
      },
    }),
    prisma.zone.upsert({
      where: { id: 'zone-b' },
      update: {},
      create: {
        id: 'zone-b',
        name: 'B',
        color: '#33FF57',
        address: 'Zone B - South Area',
        coordinates: { lat: 10.762622, lng: 106.660173 },
      },
    }),
    prisma.zone.upsert({
      where: { id: 'zone-c' },
      update: {},
      create: {
        id: 'zone-c',
        name: 'C',
        color: '#3357FF',
        address: 'Zone C - East Area',
        coordinates: { lat: 10.762623, lng: 106.660172 },
      },
    }),
    prisma.zone.upsert({
      where: { id: 'zone-d' },
      update: {},
      create: {
        id: 'zone-d',
        name: 'D',
        color: '#F3FF33',
        address: 'Zone D - West Area',
        coordinates: { lat: 10.762621, lng: 106.660172 },
      },
    }),
  ]);

  // Create land plots for each zone
  const landPlots: any[] = [];
  for (const zone of zones) {
    for (let i = 1; i <= 3; i++) {
      const plotId = `plot-${zone.name.toLowerCase()}-${i}`;
      const zoneCoords = zone.coordinates as { lat: number; lng: number };
      
      const plot = await prisma.landPlot.upsert({
        where: { id: plotId },
        update: {},
        create: {
          id: plotId,
          name: `Plot ${zone.name}${i}`,
          soilType: 'Loamy',
          area: 100 + Math.random() * 50, // Random area between 100-150 sqm
          coordinates: {
            lat: zoneCoords.lat + (Math.random() - 0.5) * 0.001,
            lng: zoneCoords.lng + (Math.random() - 0.5) * 0.001,
          },
          status: 'EMPTY',
          notes: `Land plot ${zone.name}${i} in ${zone.name} zone`,
          zoneId: zone.id,
        },
      });
      landPlots.push(plot);
    }
  }

  // Create crops
  const crops = await Promise.all([
    prisma.crop.upsert({
      where: { id: 'crop-orange' },
      update: {},
      create: {
        id: 'crop-orange',
        name: 'Orange',
        category: 'FRUIT',
        varietyCount: 3,
        daysToHarvest: 180,
        suggestedPlantingTime: ['Spring', 'Summer'],
        expectedYield: 25.5, // kg per sqm
        careHistory: {
          seasons: ['2023-Q1', '2023-Q2'],
          notes: 'Good yield in previous seasons',
        },
      },
    }),
    prisma.crop.upsert({
      where: { id: 'crop-watermelon' },
      update: {},
      create: {
        id: 'crop-watermelon',
        name: 'Watermelon',
        category: 'FRUIT',
        varietyCount: 2,
        daysToHarvest: 90,
        suggestedPlantingTime: ['Spring'],
        expectedYield: 15.0,
        careHistory: {
          seasons: ['2023-Q2'],
          notes: 'Requires good irrigation',
        },
      },
    }),
    prisma.crop.upsert({
      where: { id: 'crop-cabbage' },
      update: {},
      create: {
        id: 'crop-cabbage',
        name: 'Green Cabbage',
        category: 'VEGETABLE',
        varietyCount: 1,
        daysToHarvest: 70,
        suggestedPlantingTime: ['Winter', 'Spring'],
        expectedYield: 8.5,
        careHistory: {
          seasons: ['2023-Q4'],
          notes: 'Susceptible to pests',
        },
      },
    }),
    prisma.crop.upsert({
      where: { id: 'crop-tomato' },
      update: {},
      create: {
        id: 'crop-tomato',
        name: 'Tomato',
        category: 'ROOT_VEGETABLE',
        varietyCount: 4,
        daysToHarvest: 85,
        suggestedPlantingTime: ['Spring', 'Summer'],
        expectedYield: 12.0,
        careHistory: {
          seasons: ['2023-Q1', '2023-Q2'],
          notes: 'High demand crop',
        },
      },
    }),
  ]);

  // Create services
  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: 'service-soil-prep' },
      update: {},
      create: {
        id: 'service-soil-prep',
        code: 'SOIL_PREP',
        name: 'Soil Preparation',
        costPerSqm: 2.5,
        duration: 4,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-planting' },
      update: {},
      create: {
        id: 'service-planting',
        code: 'PLANTING',
        name: 'Seed Planting',
        costPerSqm: 1.5,
        duration: 2,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-watering' },
      update: {},
      create: {
        id: 'service-watering',
        code: 'WATERING',
        name: 'Watering',
        costPerSqm: 0.5,
        duration: 1,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-pesticide' },
      update: {},
      create: {
        id: 'service-pesticide',
        code: 'PESTICIDE',
        name: 'Pesticide Application',
        costPerSqm: 3.0,
        duration: 3,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-fertilizing' },
      update: {},
      create: {
        id: 'service-fertilizing',
        code: 'FERTILIZING',
        name: 'Fertilizing',
        costPerSqm: 2.0,
        duration: 2,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-pruning' },
      update: {},
      create: {
        id: 'service-pruning',
        code: 'PRUNING',
        name: 'Pruning',
        costPerSqm: 1.8,
        duration: 2,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-harvesting' },
      update: {},
      create: {
        id: 'service-harvesting',
        code: 'HARVESTING',
        name: 'Harvesting',
        costPerSqm: 4.0,
        duration: 4,
      },
    }),
  ]);

  // Create some crop plantings
  const plantings = await Promise.all([
    prisma.cropPlanting.upsert({
      where: { id: 'planting-1' },
      update: {},
      create: {
        id: 'planting-1',
        cropId: crops[0].id, // Orange
        landPlotId: landPlots[0].id,
        plantingDate: new Date('2024-01-15'),
        harvestDate: new Date('2024-07-15'),
        actualYield: 2500, // kg
        status: 'PLANTED',
        notes: 'Spring orange planting',
      },
    }),
    prisma.cropPlanting.upsert({
      where: { id: 'planting-2' },
      update: {},
      create: {
        id: 'planting-2',
        cropId: crops[3].id, // Tomato
        landPlotId: landPlots[1].id,
        plantingDate: new Date('2024-02-01'),
        harvestDate: new Date('2024-05-01'),
        actualYield: 1200, // kg
        status: 'HARVESTED',
        notes: 'Early tomato harvest',
      },
    }),
  ]);

  // Create some worker assignments
  const assignments = await Promise.all([
    prisma.workerAssignment.upsert({
      where: { id: 'assignment-1' },
      update: {},
      create: {
        id: 'assignment-1',
        workerId: workers[0].id,
        landPlotId: landPlots[0].id,
        workDate: new Date('2024-01-20'),
        startTime: new Date('2024-01-20T08:00:00'),
        endTime: new Date('2024-01-20T16:00:00'),
        hourlyRate: 15,
        task: 'Soil Preparation',
        landArea: 120,
        cropType: 'Orange',
        status: 'COMPLETED',
        paymentStatus: 'PAID',
      },
    }),
    prisma.workerAssignment.upsert({
      where: { id: 'assignment-2' },
      update: {},
      create: {
        id: 'assignment-2',
        workerId: workers[1].id,
        landPlotId: landPlots[1].id,
        workDate: new Date('2024-01-21'),
        startTime: new Date('2024-01-21T09:00:00'),
        endTime: new Date('2024-01-21T17:00:00'),
        hourlyRate: 18,
        task: 'Planting',
        landArea: 110,
        cropType: 'Tomato',
        status: 'ASSIGNED',
        paymentStatus: 'PENDING',
      },
    }),
  ]);

  // Create some land services
  const landServices = await Promise.all([
    prisma.landService.upsert({
      where: { id: 'land-service-1' },
      update: {},
      create: {
        id: 'land-service-1',
        serviceId: services[0].id, // Soil Preparation
        landPlotId: landPlots[0].id,
        workerId: workers[0].id,
        scheduledAt: new Date('2024-01-20T08:00:00'),
        completedAt: new Date('2024-01-20T12:00:00'),
        duration: 4,
        cost: 300, // 2.5 * 120 sqm
        status: 'COMPLETED',
        notes: 'Soil preparation completed successfully',
      },
    }),
    prisma.landService.upsert({
      where: { id: 'land-service-2' },
      update: {},
      create: {
        id: 'land-service-2',
        serviceId: services[1].id, // Planting
        landPlotId: landPlots[1].id,
        workerId: workers[1].id,
        scheduledAt: new Date('2024-01-21T09:00:00'),
        duration: 2,
        cost: 165, // 1.5 * 110 sqm
        status: 'PENDING',
        notes: 'Scheduled for tomato planting',
      },
    }),
  ]);

  // Create some planting schedules
  const schedules = await Promise.all([
    prisma.plantingSchedule.upsert({
      where: { id: 'schedule-1' },
      update: {},
      create: {
        id: 'schedule-1',
        landPlotId: landPlots[0].id,
        season: '2024-Q1',
        status: 'LOCKED',
        cropType: 'Orange',
        plannedServices: [
          { service: 'Soil Preparation', date: '2024-01-15' },
          { service: 'Planting', date: '2024-01-20' },
          { service: 'Watering', date: '2024-01-25' },
        ],
        lockedUntil: new Date('2024-01-01'),
      },
    }),
    prisma.plantingSchedule.upsert({
      where: { id: 'schedule-2' },
      update: {},
      create: {
        id: 'schedule-2',
        landPlotId: landPlots[1].id,
        season: '2024-Q1',
        status: 'OPEN',
        cropType: 'Tomato',
        plannedServices: [
          { service: 'Planting', date: '2024-02-01' },
          { service: 'Watering', date: '2024-02-05' },
        ],
      },
    }),
  ]);

  // Create some work schedules
  const workSchedules = await Promise.all([
    prisma.workSchedule.upsert({
      where: { id: 'work-schedule-1' },
      update: {},
      create: {
        id: 'work-schedule-1',
        workerId: workers[0].id,
        workDate: new Date('2024-01-20'),
        tasks: ['Soil Preparation', 'Watering'],
        totalHours: 8,
        totalPay: 120, // 8 * 15
      },
    }),
    prisma.workSchedule.upsert({
      where: { id: 'work-schedule-2' },
      update: {},
      create: {
        id: 'work-schedule-2',
        workerId: workers[1].id,
        workDate: new Date('2024-01-21'),
        tasks: ['Planting', 'Fertilizing'],
        totalHours: 8,
        totalPay: 144, // 8 * 18
      },
    }),
  ]);

  console.log('✅ Database seeding completed!');
  console.log(`📊 Created ${zones.length} zones`);
  console.log(`📊 Created ${landPlots.length} land plots`);
  console.log(`📊 Created ${crops.length} crops`);
  console.log(`📊 Created ${services.length} services`);
  console.log(`📊 Created ${plantings.length} crop plantings`);
  console.log(`📊 Created ${assignments.length} worker assignments`);
  console.log(`📊 Created ${landServices.length} land services`);
  console.log(`📊 Created ${schedules.length} planting schedules`);
  console.log(`📊 Created ${workSchedules.length} work schedules`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 