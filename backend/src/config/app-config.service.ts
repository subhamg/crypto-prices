import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './configuration';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService<AppConfig>) {}

  get port(): number {
    return this.configService.getOrThrow('PORT');
  }

  get redisHost(): string {
    return this.configService.getOrThrow('REDIS_HOST');
  }

  get redisPort(): number {
    return this.configService.getOrThrow('REDIS_PORT');
  }

  get coingeckoBase(): string {
    return this.configService.getOrThrow('COINGECKO_BASE');
  }

  get postgresHost(): string {
    return this.configService.getOrThrow('POSTGRES_HOST');
  }

  get postgresPort(): number {
    return this.configService.getOrThrow('POSTGRES_PORT');
  }

  get postgresUser(): string {
    return this.configService.getOrThrow('POSTGRES_USER');
  }

  get postgresPassword(): string {
    return this.configService.getOrThrow('POSTGRES_PASSWORD');
  }

  get postgresDb(): string {
    return this.configService.getOrThrow('POSTGRES_DB');
  }

  get cacheTtlSeconds(): number {
    return this.configService.getOrThrow('CACHE_TTL_SECONDS');
  }
}
