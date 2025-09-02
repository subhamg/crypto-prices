import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { PriceCache } from './cache/price-cache.service';
import { CoinGeckoProvider } from './provider/coingecko.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceSnapshot } from './entities/price-snapshot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PriceSnapshot])],
  controllers: [PricesController],
  providers: [PricesService, PriceCache, CoinGeckoProvider],
})
export class PricesModule {}
