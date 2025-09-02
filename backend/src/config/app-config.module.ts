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
      }),
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
