import { Injectable } from '@nestjs/common'
import { IRedisClient } from './redis.boundarie';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class RedisClient implements IRedisClient{
  constructor(@CACHE_MANAGER private cacheManager: Cache) {}

  async get(key: string): Promise<string | null> {
    return this.cacheManager.get<string>(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<'OK' | null> {
    await this.cacheManager.set(key, value, { ttl });
    return 'OK';
  }

  async del(key: string): Promise<number> {
    return this.cacheManager.del(key);
  }
}
