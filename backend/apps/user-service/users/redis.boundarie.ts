export abstract class IRedisClient {
  abstract get(key: string): Promise<string | null>
  abstract set(key: string, value: string, ttl?: number): Promise<'OK' | null>
  abstract del(key: string): Promise<number>
}