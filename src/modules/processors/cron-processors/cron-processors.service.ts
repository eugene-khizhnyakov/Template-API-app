import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CronProcessorsService {
  private readonly logger = new Logger(CronProcessorsService.name);
}
