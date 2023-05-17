import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigurationModule } from '../../modules/configurations/configuration.module';
import databaseConfig from './database-config';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig as TypeOrmModuleOptions), ConfigurationModule],
})
export class DatabaseModule {}
