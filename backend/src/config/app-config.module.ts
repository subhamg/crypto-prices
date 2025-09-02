import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import configuration from './configuration';
import { AppConfigService } from './app-config.service';

@Global()
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
        CACHE_TTL_SECONDS: Joi.number().min(1).max(1800).default(60),
        POSTGRES_HOST: Joi.string().when('NODE_ENV', {
          is: 'test',
          then: Joi.optional(),
          otherwise: Joi.required(),
        }),
        POSTGRES_PORT: Joi.number().when('NODE_ENV', {
          is: 'test',
          then: Joi.optional(),
          otherwise: Joi.required(),
        }),
        POSTGRES_USER: Joi.string().when('NODE_ENV', {
          is: 'test',
          then: Joi.optional(),
          otherwise: Joi.required(),
        }),
        POSTGRES_PASSWORD: Joi.string().when('NODE_ENV', {
          is: 'test',
          then: Joi.optional(),
          otherwise: Joi.required(),
        }),
        POSTGRES_DB: Joi.string().when('NODE_ENV', {
          is: 'test',
          then: Joi.optional(),
          otherwise: Joi.required(),
        }),
      }),
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
