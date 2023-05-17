/* eslint-disable security/detect-object-injection */
/* eslint-disable  @typescript-eslint/no-explicit-any */

import { LoggerService as NestLoggerService } from '@nestjs/common';
import { isObject } from '@nestjs/common/utils/shared.utils';
import { utilities } from 'nest-winston';
import winston, { Logger } from 'winston';

import { LoggerLevelsEnum } from './enums';

const RESTRICTED_FIELDS = new Set(['cookie']);

export const replacer = (key: string, value: string): any => {
  if (RESTRICTED_FIELDS.has(key)) {
    return 'XXXXXX';
  }
  return value;
};

export class LoggerService implements NestLoggerService {
  private readonly context: string;
  private readonly logger: Logger;

  constructor(context = 'System') {
    this.context = context;
    this.logger = winston.createLogger({
      exitOnError: false,
      format: winston.format.combine(
        winston.format.errors({ stack: true }),

        winston.format.timestamp(),
        winston.format.ms(),
        utilities.format.nestLike('MM', { prettyPrint: true })
      ),
      levels: {
        [LoggerLevelsEnum.DEBUG]: 0,
        [LoggerLevelsEnum.ERROR]: 1,
        [LoggerLevelsEnum.WARN]: 2,
        [LoggerLevelsEnum.INFO]: 3,
        [LoggerLevelsEnum.VERBOSE]: 4,
      },

      transports: [new winston.transports.Console({ handleExceptions: true })],
    });
  }

  private static getFullLogMessage(method: string, message: string | Record<string, any> | []): string {
    method = method.length === 0 ? method : `${method}()`;
    return `${method}  ${typeof message === 'object' ? JSON.stringify(message) : message}`;
  }

  public info(
    method: string,
    message: string | Record<string, any> | [],
    meta?: string | Record<string, any> | unknown
  ): void {
    this.callMethod(LoggerLevelsEnum.INFO, method, message, meta);
  }

  public error(
    method: string,
    error: string | Error,
    meta?: string | Record<string, any> | Error,
    context?: string
  ): void {
    if (error instanceof Error) {
      if (isObject(error.message)) {
        error.message = JSON.stringify(error.message, replacer);
      }
      this.logger.error(LoggerService.getFullLogMessage(method, `Error: ${error.message}`), {
        context,
        stack: error.stack,
        meta,
      });

      return;
    }

    const errorMeta: any = {};
    if (meta) {
      if (typeof meta === 'string') {
        errorMeta.stack = meta;
      } else if (meta instanceof Error) {
        if (isObject(meta.message)) {
          meta.message = JSON.stringify(meta.message, replacer);
        }
        errorMeta.stack = meta.stack;
      } else {
        errorMeta.meta = meta;
      }
    }
    this.logger.error(LoggerService.getFullLogMessage(method, `Error: ${error}`), {
      context: this.context,
      ...errorMeta,
    });
  }

  public warn(method: string, message: string | Record<string, any> | [], meta?: string | Record<string, any>): void {
    this.callMethod(LoggerLevelsEnum.WARN, method, message, meta);
  }

  public debug(method: string, message: string | Record<string, any> | [], meta?: string | Record<string, any>): void {
    this.callMethod(LoggerLevelsEnum.DEBUG, method, message, meta);
  }

  public verbose(
    method: string,
    message: string | Record<string, any> | [],
    meta?: string | Record<string, any>
  ): void {
    this.callMethod(LoggerLevelsEnum.VERBOSE, method, message, meta);
  }

  public log(method: string, message: string | Record<string, any> | [], meta?: string | Record<string, any>): void {
    this.callMethod(LoggerLevelsEnum.INFO, method, message, meta);
  }

  private callMethod(
    logLevel: string,
    method: string,
    message: string | Record<string, any> | [],
    meta?: string | Record<string, any> | unknown
  ): void {
    const fullLogMessage = LoggerService.getFullLogMessage(method, message);

    if (typeof meta === 'string') {
      this.logger[logLevel](fullLogMessage, { context: this.context, meta });
      return;
    }

    if (meta !== null && typeof meta === 'object') {
      this.logger[logLevel](fullLogMessage, { context: this.context, meta });
      return;
    }
    this.logger[logLevel](fullLogMessage, { context: this.context });
  }
}
