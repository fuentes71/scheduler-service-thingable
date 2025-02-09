import { Body, Controller, Delete, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CronJobService } from './cron-job.service';
import { CronJobDto } from './dto';

@ApiTags('Cron Job')
@Controller('cron-job')
export class CronJobController {
  constructor(private readonly cronJobService: CronJobService) {}

  @Post()
  @ApiOperation({ summary: 'Inicia o intervalo do Cron Job.' })
  startCronInterval(@Body() cronInterval: CronJobDto) {
    this.cronJobService.startCronInterval(cronInterval);
  }

  @Delete()
  @ApiOperation({ summary: 'Exclui o intervalo do Cron Job.' })
  removeCronInterval() {
    this.cronJobService.removeCronInterval();
  }
}
