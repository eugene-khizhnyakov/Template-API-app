import { Injectable, NestMiddleware } from '@nestjs/common';
import { differenceInMilliseconds } from 'date-fns';
import { NextFunction, Request, Response } from 'express';

import { LoggerService, replacer } from '../logger/logger.service';
import { EMPTY_STRING } from '../modules/utils/constants';
import { LogTypeEnum } from './types';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger: LoggerService;

  constructor() {
    this.logger = new LoggerService(RequestLoggerMiddleware.name);
  }

  private static getResponseTime(startTimestamp: number): string {
    return `${differenceInMilliseconds(new Date(), startTimestamp)}ms`;
  }

  private static getRemoteAddress(request: Request): string {
    return request.ip || (request.connection && request.connection.remoteAddress) || undefined;
  }

  private static getRequestVerboseMessage(request: Request): string {
    const keysList = new Set(['method', 'url', 'originalUrl', 'headers', 'cookies', 'params', 'query', 'body']);

    let verbose = EMPTY_STRING;
    for (const key of Object.keys(request)) {
      if (keysList.has(key)) {
        verbose += `${key}: ${JSON.stringify(request[key], replacer)} | `;
      }
    }

    return verbose;
  }

  private static getBaseMessage(request: Request): string {
    const { method, baseUrl } = request;
    const remoteAddress = RequestLoggerMiddleware.getRemoteAddress(request);

    return `${method} ${baseUrl} ${remoteAddress}`;
  }

  private static getLogType(type: LogTypeEnum): string {
    switch (type) {
      case LogTypeEnum.REQUEST:
        return '-->';
      case LogTypeEnum.RESPONSE:
      case LogTypeEnum.RESPONSE_ERROR:
        return '<--';
      default:
        return '---';
    }
  }

  private static getRequestInfoMessage(baseMessage): string {
    return `${RequestLoggerMiddleware.getLogType(LogTypeEnum.REQUEST)} ${baseMessage}`;
  }

  private static getResponseMessage(
    logType: LogTypeEnum,
    statusCode: number,
    statusMessage: string,
    responseTime: string,
    baseMessage: string
  ): string {
    return `${RequestLoggerMiddleware.getLogType(
      logType
    )} ${baseMessage} ${statusCode} ${statusMessage} ${responseTime}`;
  }

  use(request: Request, response: Response, next: NextFunction): void {
    // Method name is empty string only for middleware log messages.
    const methodName = EMPTY_STRING;
    const startTimestamp = Date.now();
    const baseMessage = RequestLoggerMiddleware.getBaseMessage(request);

    this.logger.info(methodName, RequestLoggerMiddleware.getRequestInfoMessage(baseMessage));

    this.logger.verbose(methodName, RequestLoggerMiddleware.getRequestVerboseMessage(request));

    response.on('close', () => {
      const regEx = /^[45]\d{2}$/;

      const { statusCode, statusMessage } = response;
      const responseTime = RequestLoggerMiddleware.getResponseTime(startTimestamp);

      if (regEx.test(statusCode.toString())) {
        this.logger.error(
          methodName,
          RequestLoggerMiddleware.getResponseMessage(
            LogTypeEnum.RESPONSE_ERROR,
            statusCode,
            statusMessage,
            responseTime,
            baseMessage
          )
        );
      } else {
        this.logger.info(
          methodName,
          RequestLoggerMiddleware.getResponseMessage(
            LogTypeEnum.RESPONSE,
            statusCode,
            statusMessage,
            responseTime,
            baseMessage
          )
        );
      }
    });

    next();
  }
}
