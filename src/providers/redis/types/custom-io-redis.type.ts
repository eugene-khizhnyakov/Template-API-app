import IORedis from 'ioredis';

export type CustomIORedis = IORedis.Redis & { connected: boolean; ready: boolean };
