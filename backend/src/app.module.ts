import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import * as Joi from 'joi';

import configuration from './config/configuration';
import { AppConfigService } from './config/app-config.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PricesModule } from './prices/prices.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        REDIS_HOST: Joi.string().hostname().required(),
        REDIS_PORT: Joi.number().required(),
        COINGECKO_BASE: Joi.string().uri().required(),
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [AppConfigService],
      useFactory: async (cfg: AppConfigService) => ({
        ttl: 60,
        store: await redisStore({
          socket: {
            host: cfg.redisHost,
            port: cfg.redisPort,
          },
        }),
      }),
    }),
    PricesModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppConfigService],
  exports: [AppConfigService],
})
export class AppModule {}
