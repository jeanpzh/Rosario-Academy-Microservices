import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ConfigService } from '@nestjs/config'
import KeyvRedis from '@keyv/redis'

const cacheConfig: CacheModuleAsyncOptions = {
  isGlobal: true,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const redisUrl = `redis://${configService.get('REDIS_HOST') ?? 'localhost'}:${configService.get('REDIS_PORT') ?? '6379'}`

    return {
      stores: [new KeyvRedis(redisUrl)],
      ttl: parseInt(configService.get('REDIS_TTL') ?? '600') * 1000 // TTL in milliseconds
    }
  }
}
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync(cacheConfig)
  ],
  exports: [CacheModule]
})
export class CacheConfigModule {}
