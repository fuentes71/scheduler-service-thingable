import { PrismaClient } from '@prisma/client';

const now = new Date();
const cronIntervalDefault = {
  days_week: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  hours: 0,
  minutes: 0,
  seconds: 30,
 
};

export async function createCronInterval(prisma: PrismaClient) {
  const cronInterval = await prisma.cronInterval.create({ data: cronIntervalDefault });
  return cronInterval;
}
