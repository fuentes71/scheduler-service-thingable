import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Partitioners } from 'kafkajs';

import { CronJobDto } from './dto';

@Injectable()
export class CronJobService {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_CLIENT_ID,
        brokers: [process.env.KAFKA_URL],
      },
      consumer: {
        groupId: process.env.KAFKA_CONSUMER_ID,
        allowAutoTopicCreation: true,
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner,
      },
    },
  })
  private client: ClientKafka;
  private readonly logger = new Logger(CronJobService.name);
  private jobs: Map<string, CronJob> = new Map();
  private jobName = 'myCronJob';

  constructor(private schedulerRegistry: SchedulerRegistry) {}

  async onModuleInit(): Promise<void> {
    const requestPatterns = ['cron-job-event'];

    requestPatterns.map(async pattern => {
      this.client.subscribeToResponseOf(pattern);
      await this.client.connect();
    });
  }

  async startCronInterval(cronInterval: CronJobDto): Promise<string> {
    const { daysWeek, interval } = cronInterval;

    if (interval.hours === 0 && interval.minutes === 0 && interval.seconds === 0)
      throw new BadRequestException('O intervalo não pode ser 0 horas, 0 minutos e 0 segundos.');

    const daysMap: Record<string, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    const cronDays = daysWeek.map(day => daysMap[day]).join(',');

    if (this.schedulerRegistry.getCronJobs().has(this.jobName)) {
      this.jobs.get(this.jobName).stop();
      this.schedulerRegistry.deleteInterval(this.jobName);
    }

    const intervalInSeconds = interval.hours * 3600 + interval.minutes * 60 + interval.seconds;
    const cronExpression = `*/${intervalInSeconds} * * * * ${cronDays}`;

    const now = new Date();
    const cronDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const job = new CronJob(cronExpression, async () => {
      this.logger.log('Cron job em execução...');
      await this.client.emit('cron-job-event', JSON.stringify({ message: 'cron job em excecução.' }));
    });
    this.logger.log('Cron job programado');

    this.jobs.set(this.jobName, job);
    this.schedulerRegistry.addCronJob(this.jobName, job);
    this.schedulerRegistry.addInterval(this.jobName, job);
    job.start();

    return 'Cron Job criado com sucesso!';
  }

  async removeCronInterval(): Promise<string> {
    this.jobs.clear();
    await this.schedulerRegistry.getCronJobs().forEach(job => job.stop());
    await this.schedulerRegistry.deleteCronJob(this.jobName);

    return 'Cron Job removido com sucesso!';
  }
}
