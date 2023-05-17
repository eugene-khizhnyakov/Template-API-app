import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { LoggerModule } from './logger/logger.module';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { AdminsApiModule } from './modules/apis/admins-api/admins-api.module';
import { ConfigurationModule } from './modules/configurations/configuration.module';
import { CronSchedulerModule } from './modules/cron-scheduler/cron-scheduler.module';
import { ManagersModule } from './modules/processors/managers.module';
import { ModelsModule } from './modules/models/models.module';
import { DatabaseModule } from './providers/database/postgres.module';
import { RedisModule } from './providers/redis/redis.module';

@Module({
  imports: [
    ConfigurationModule,
    LoggerModule,
    ModelsModule,
    ManagersModule,
    CronSchedulerModule,
    DatabaseModule,
    AdminsApiModule,
    RedisModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
