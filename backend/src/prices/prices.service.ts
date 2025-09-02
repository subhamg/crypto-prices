import { Injectable } from '@nestjs/common';
import { PriceCache } from './cache/price-cache.service';
import { CoinGeckoProvider } from './provider/coingecko.provider';

type Symbols = 'TON' | 'USDT';

@Injectable()
export class PricesService {
  constructor(
    private cache: PriceCache,
    private provider: CoinGeckoProvider,
  ) {}

  async getPair(base: Symbols, quote: Symbols) {
    if (base === quote) {
      return { price: 1, source: 'derived', asOf: new Date() };
    }

    const cached = await this.cache.get(base, quote);
    console.log(`cached: ${cached}`);
    if (cached) {
      return { price: cached, source: 'cache', asOf: new Date() };
    }

    const usd = await this.provider.getUsdPrices(['TON', 'USDT']);
    const price = usd[base] / usd[quote];
    console.log(`price: ${price}`);
    await this.cache.set(base, quote, price, 60);
    return { price, source: this.provider.name, asOf: new Date() };
  }

  listPairs() {
    return ['TON/USDT', 'USDT/TON'];
  }
}
