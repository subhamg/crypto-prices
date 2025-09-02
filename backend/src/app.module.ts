import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { AppConfigService } from './config/app-config.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PricesModule } from './prices/prices.module';
import { AppConfigModule } from './config/app-config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceSnapshot } from './prices/entities/price-snapshot.entity';

const isTestEnv = process.env.NODE_ENV === 'test';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (cfg: AppConfigService) => {
        if (isTestEnv) {
          return {
            type: 'sqlite',
            database: ':memory:',
            entities: [PriceSnapshot],
            synchronize: true,
          } as const;
        }
        return {
          type: 'postgres',
          host: cfg.postgresHost,
          port: cfg.postgresPort,
          username: cfg.postgresUser,
          password: cfg.postgresPassword,
          database: cfg.postgresDb,
          entities: [PriceSnapshot],
          synchronize: true,
        } as const;
      },
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [AppConfigService],
      useFactory: async (cfg: AppConfigService) => {
        if (isTestEnv) {
          return { ttl: cfg.cacheTtlSeconds } as const;
        }
        const store = await redisStore({
          socket: { host: cfg.redisHost, port: cfg.redisPort },
        });
        return { ttl: cfg.cacheTtlSeconds, store } as const;
      },
    }),
    PricesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
