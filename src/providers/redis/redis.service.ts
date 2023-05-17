import { Inject, Injectable } from '@nestjs/common';
import IORedis, { KeyType, Ok, RedisOptions, ValueType } from 'ioredis';

import { LoggerService } from '../../logger/logger.service';
import { CustomIORedis } from './types/custom-io-redis.type';

@Injectable()
export class RedisService {
  private readonly client: CustomIORedis;
  private readonly logger: LoggerService;

  constructor(@Inject('RedisOptions') options: RedisOptions) {
    this.client = new IORedis(options) as CustomIORedis;
    this.logger = new LoggerService(RedisService.name);
  }

  public getClient(): CustomIORedis {
    return this.client;
  }

  async get(key: KeyType): Promise<ValueType> {
    return this.client.get(key);
  }

  async set(key: KeyType, value: ValueType, ttl?: number): Promise<Ok | null> {
    const expireTimeFormat = 'EX';
    return ttl ? this.client.set(key, value, expireTimeFormat, ttl) : this.client.set(key, value);
  }

  async delete(key: KeyType): Promise<number> {
    return this.client.del(key);
  }

  async keys(searchPattern = '*'): Promise<KeyType[]> {
    return this.client.keys(searchPattern);
  }

  async exists(key: KeyType): Promise<boolean> {
    const isExists = await this.client.exists(key);
    return !!isExists;
  }

  async setAdd(setName: string, value: ValueType): Promise<number> {
    return this.client.sadd(setName, value);
  }

  async setRemove(setName: string, value: ValueType): Promise<number> {
    return this.client.srem(setName, value);
  }

  async setMembers(setName: string): Promise<string[]> {
    return this.client.smembers(setName);
  }

  async incrby(key: KeyType, number: number): Promise<number> {
    return this.client.incrby(key, number);
  }

  async decrby(key: KeyType, number: number): Promise<number> {
    return this.client.decrby(key, +number);
  }
}
