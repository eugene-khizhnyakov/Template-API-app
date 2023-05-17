import { Module } from '@nestjs/common';
import { CronProcessorsModule } from './cron-processors/cron-processors.module';

const modules = [CronProcessorsModule];
@Module({
  imports: modules,
  exports: modules,
})
export class ManagersModule {}
