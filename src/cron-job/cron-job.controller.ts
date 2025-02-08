import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CronJobService } from './cron-job.service';
import { CronJobDto } from './dto';

@ApiTags('Cron Job')
@Controller('cron-job')
export class CronJobController {
  constructor(private readonly cronJobService: CronJobService) { }
  
  @Post()
  setCronInterval(@Body() cronInterval: CronJobDto) {
    this.cronJobService.setCronInterval(cronInterval);
  }

  @Post('/start')
  startCronInterval() {
    this.cronJobService.startCronInterval();
  }

  @Put()
  stopCronInterval() {
    this.cronJobService.stopCronInterval();
  }

  @Delete()
  removeCronInterval() {
    this.cronJobService.removeCronInterval();
  }
}
