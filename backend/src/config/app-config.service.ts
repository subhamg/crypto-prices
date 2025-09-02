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
}
