import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Clean database before tests
  if (process.env.NODE_ENV === 'test') {
    await prisma.workSchedule.deleteMany();
    await prisma.workerAssignment.deleteMany();
    await prisma.landService.deleteMany();
    await prisma.plantingSchedule.deleteMany();
    await prisma.cropPlanting.deleteMany();
    await prisma.landPlot.deleteMany();
    await prisma.service.deleteMany();
    await prisma.crop.deleteMany();
    await prisma.zone.deleteMany();
    await prisma.user.deleteMany();
  }
});

afterAll(async () => {
  await prisma.$disconnect();
}); 