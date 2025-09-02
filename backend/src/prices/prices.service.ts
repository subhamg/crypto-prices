import { Injectable } from '@nestjs/common';
import { PriceCache } from './cache/price-cache.service';
import { CoinGeckoProvider } from './provider/coingecko.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceSnapshot } from './entities/price-snapshot.entity';
import { AppConfigService } from 'src/config/app-config.service';
import { SymbolCode, SUPPORTED_SYMBOLS, getAllPairs } from './symbols';

@Injectable()
export class PricesService {
  constructor(
    private cache: PriceCache,
    private provider: CoinGeckoProvider,
    @InjectRepository(PriceSnapshot)
    private priceRepo: Repository<PriceSnapshot>,
    private config: AppConfigService,
  ) {}

  async getPair(base: SymbolCode, quote: SymbolCode) {
    if (base === quote) {
      return { price: 1, source: 'derived', asOf: new Date() };
    }

    const cached = await this.cache.get(base, quote);
    console.log(`cached: ${cached}`);
    if (cached) {
      return { price: cached, source: 'cache', asOf: new Date() };
    }

    const usd = await this.provider.getUsdPrices([...SUPPORTED_SYMBOLS]);
    const price = usd[base] / usd[quote];
    console.log(`price: ${price}`);
    await this.cache.set(base, quote, price, this.config.cacheTtlSeconds);
    const snapshot = this.priceRepo.create({
      base,
      quote,
      price,
      source: this.provider.name,
    });
    await this.priceRepo.save(snapshot);
    return { price, source: this.provider.name, asOf: snapshot.createdAt };
  }

  listPairs() {
    return getAllPairs();
  }
}
