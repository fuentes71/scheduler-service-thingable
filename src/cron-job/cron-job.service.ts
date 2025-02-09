import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { SchedulerRegistry } from '@nestjs/schedule';

import { Partitioners } from 'kafkajs';
import { CronJob } from 'cron';

import { ICustomResponseService } from 'src/shared/interfaces';
import { CronJobDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';


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


  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private prismaService: PrismaService,
  ) { }

  async onModuleInit(): Promise<void> {
    const requestPatterns = ['cron-job-event'];

    requestPatterns.map(async pattern => {
      this.client.subscribeToResponseOf(pattern);
      await this.client.connect();
    });
  }

  async setCronInterval(cronInterval: CronJobDto): Promise<ICustomResponseService<string>> {
    const { daysWeek, interval } = cronInterval;

    if (interval.hours === 0 && interval.minutes === 0 && interval.seconds === 0)
      throw new BadRequestException('O intervalo não pode ser 0 horas, 0 minutos e 0 segundos.');

    await this.prismaService.cronInterval.deleteMany();

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

    const intervalInSeconds = (interval.hours * 3600) + (interval.minutes * 60) + interval.seconds;
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

    await this.prismaService.cronInterval.create({
      data: {
        days_week: daysWeek,
        hours: interval.hours,
        minutes: interval.minutes,
        seconds: interval.seconds,
        start_time: cronDate,
        end_time: cronDate,
      },
    });

    return { data: 'Cron Job criado com sucesso!' };
  }

  async startCronInterval(): Promise<ICustomResponseService<string>> {
    const job = this.jobs.get(this.jobName);

    if (!job) throw new BadRequestException('Cron Job não encontrado.');

    await this.client.emit('cron-job-event', JSON.stringify({ message: `cron job inicializado.` }));
    job.start();

    return { data: 'Cron Job iniciado com sucesso!' };
  }

  async stopCronInterval(): Promise<ICustomResponseService<string>> {
    this.jobs.forEach((job) => job.stop());
    await this.schedulerRegistry.getCronJobs().forEach((job) => job.stop());

    return { data: 'Cron Job parado com sucesso!' };
  }
  async removeCronInterval(): Promise<ICustomResponseService<string>> {
    this.jobs.clear();
    await this.schedulerRegistry.getCronJobs().forEach((job) => job.stop());
    await this.schedulerRegistry.deleteCronJob(this.jobName)

    return { data: 'Cron Job removido com sucesso!' };
  }

}
