import { Injectable } from '@nestjs/common';
import { validateSync } from 'class-validator';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { RedisOptions } from 'ioredis';
import * as path from 'path';

import { LoggerService } from '../../logger/logger.service';
import { convertStringToBoolean } from '../utils/string';
import { ConfigurationDto } from './dtos/configuration.dto';
import { IDatabaseOptions, IValidationError } from './types';

@Injectable()
export class ConfigurationService {
  private readonly logger = new LoggerService('CONFIGURATION');
  private readonly configuration: ConfigurationDto;

  constructor() {
    const configuration = new ConfigurationDto();

    Object.assign(configuration, { ...ConfigurationService.getDotenvConfiguration(), ...process.env });
    const validationResult = validateSync(configuration, { whitelist: true });

    if (validationResult && validationResult.length > 0) {
      this.logger.error(
        'Configuration invalid',
        `Validation errors:\n${this.extractValidationErrorMessages(validationResult)}`
      );
      throw new Error(`Configuration invalid\n${validationResult}`);
    }

    this.configuration = configuration;
  }

  private static getDotenvConfiguration(): Record<string, string | null> {
    const ENV_PATH = path.resolve(process.cwd(), '.env');
    return fs.existsSync(ENV_PATH) ? dotenv.parse(fs.readFileSync(ENV_PATH)) : {};
  }

  public get<K extends keyof ConfigurationDto>(key: K): ConfigurationDto[K] {
    if (!this.configuration[key] || this.configuration[key] === 'null') {
      return;
    }
    return this.configuration[key];
  }

  public getDBConfiguration(): IDatabaseOptions {
    return {
      host: this.get('DB_HOST'),
      port: +this.get('DB_PORT'),
      username: this.get('DB_USERNAME'),
      password: this.get('DB_PASSWORD'),
      database: this.get('DB_NAME'),
      logging: convertStringToBoolean(this.get('DB_LOGGING')),
    };
  }

  public getRedisConfigurations(): RedisOptions {
    return {
      host: this.get('REDIS_HOST'),
      port: +this.get('REDIS_PORT'),
      username: this.get('REDIS_USER'),
      password: this.get('REDIS_PASSWORD'),
    };
  }

  private extractValidationErrorMessages(validationErrors: Partial<IValidationError>[]): string {
    return validationErrors.map((validationError) => ` ${Object.values(validationError.constraints)},`).join('\n');
  }
}
