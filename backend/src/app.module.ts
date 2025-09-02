import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { AppConfigService } from './config/app-config.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PricesModule } from './prices/prices.module';
import { AppConfigModule } from './config/app-config.module';

@Module({
  imports: [
    AppConfigModule,
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [AppConfigService],
      useFactory: async (cfg: AppConfigService) => {
        const isTest = process.env.NODE_ENV === 'test';
        if (isTest) {
          return { ttl: 60 } as const;
        }
        const store = await redisStore({
          socket: { host: cfg.redisHost, port: cfg.redisPort },
        });
        return { ttl: 60, store } as const;
      },
    }),
    PricesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
