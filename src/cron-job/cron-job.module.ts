import { Module } from '@nestjs/common';

import { CronJobController } from './cron-job.controller';
import { CronJobService } from './cron-job.service';

@Module({
  controllers: [CronJobController],
  providers: [CronJobService],
})
export class CronJobModule {}
