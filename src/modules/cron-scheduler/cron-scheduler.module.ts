import { Module } from '@nestjs/common';
import { CronSchedulerService } from './cron-scheduler.service';
import { CronProcessorsModule } from '../processors/cron-processors/cron-processors.module';

@Module({
  imports: [CronProcessorsModule],
  providers: [CronSchedulerService],
  exports: [CronSchedulerService],
})
export class CronSchedulerModule {}
