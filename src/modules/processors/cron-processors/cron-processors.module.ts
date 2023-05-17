import { Module } from '@nestjs/common';
import { CronProcessorsService } from './cron-processors.service';

@Module({
  imports: [],
  providers: [CronProcessorsService],
  exports: [CronProcessorsService],
})
export class CronProcessorsModule {}
