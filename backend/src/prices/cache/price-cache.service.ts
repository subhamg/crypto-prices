import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class PriceCache {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  private key(b: string, q: string) {
    return `pair:${b}:${q}`;
  }

  async get(base: string, quote: string) {
    return this.cache.get<number>(this.key(base, quote));
  }

  async set(base: string, quote: string, value: number, ttlSeconds = 60) {
    await this.cache.set(this.key(base, quote), value, ttlSeconds * 1000);
  }
}
