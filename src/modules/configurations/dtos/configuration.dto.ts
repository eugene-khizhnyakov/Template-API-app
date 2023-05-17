import { IsBooleanString, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class ConfigurationDto {
  @IsNotEmpty()
  @IsNumberString()
  APP_PORT: string;

  @IsNotEmpty()
  @IsString()
  NODE_ENV: string;

  /**
   * Database's section
   */
  @IsNotEmpty()
  @IsString()
  DB_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  DB_USERNAME: string;

  @IsNotEmpty()
  @IsString()
  DB_NAME: string;

  @IsNotEmpty()
  @IsString()
  DB_HOST: string;

  @IsNotEmpty()
  @IsString()
  DB_PORT: string;

  @IsNotEmpty()
  @IsBooleanString()
  DB_LOGGING: string;

  /**
   * Redis's section
   */
  @IsNotEmpty()
  @IsString()
  REDIS_HOST: string;

  @IsNotEmpty()
  @IsString()
  REDIS_PORT: string;

  @IsNotEmpty()
  @IsString()
  REDIS_USER: string;

  @IsNotEmpty()
  @IsString()
  REDIS_PASSWORD: string;
}
