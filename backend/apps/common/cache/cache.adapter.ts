import { Inject, Injectable, Logger } from '@nestjs/common'
import { CacheBoundarie } from './cache.boundarie'
import { Cache } from '@nestjs/cache-manager'

@Injectable()
export class CacheAdapter implements CacheBoundarie {
  private readonly logger = new Logger(CacheAdapter.name)

  constructor(@Inject('CACHE_MANAGER') private readonly cache: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const result = await this.cache.get<T>(key)
      this.logger.debug(`Cache GET ${key}: ${result ? 'HIT' : 'MISS'}`)
      return result ?? null
    } catch (error) {
      this.logger.error(`Cache GET error for key ${key}:`, error)
      return null
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    try {
      const ttlMs = ttlSeconds ? ttlSeconds * 1000 : undefined
      await this.cache.set(key, value, ttlMs)
      this.logger.debug(`Cache SET ${key} with TTL: ${ttlSeconds}s`)
    } catch (error) {
      this.logger.error(`Cache SET error for key ${key}:`, error)
      throw error
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.cache.del(key)
      this.logger.debug(`Cache DELETE ${key}`)
    } catch (error) {
      this.logger.error(`Cache DELETE error for key ${key}:`, error)
      throw error
    }
  }
}
