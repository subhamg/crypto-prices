import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { PriceCache } from './cache/price-cache.service';
import { CoinGeckoProvider } from './provider/coingecko.provider';

@Module({
  controllers: [PricesController],
  providers: [PricesService, PriceCache, CoinGeckoProvider],
})
export class PricesModule {}
