import { PrismaClient } from '@prisma/client';

import 'dotenv/config';
import { createCronInterval } from './creates/index';

const prisma = new PrismaClient();

async function execute() {
  console.log('Seeding...');
  // Adicionar abaixo os creates inseridos na pasta /seeds/creates

  await createCronInterval(prisma);
}

(async () => {
  try {
    await execute();
    console.log('✅ Seeds executados com sucesso!');
  } catch (error) {
    await import('./truncate');
    console.log('❌ Erro ao tentar executar os seeds: ');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
})();
