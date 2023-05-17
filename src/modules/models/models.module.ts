import { Module } from '@nestjs/common';

import { BaseModule } from './base/base.module';

const modules = [BaseModule];

@Module({
  imports: modules,
  exports: modules,
})
export class ModelsModule {}
