import { Injectable } from '@nestjs/common';
import { PriceCache } from './cache/price-cache.service';
import { CoinGeckoProvider } from './provider/coingecko.provider';

type Sym = 'TON' | 'USDT';

@Injectable()
export class PricesService {
  constructor(
    private cache: PriceCache,
    private provider: CoinGeckoProvider,
  ) {}

  async getPair(base: Sym, quote: Sym) {
    if (base === quote) {
      return { price: 1, source: 'derived', asOf: new Date() };
    }

    const cached = await this.cache.get(base, quote);
    if (cached) {
      return { price: cached, source: 'cache', asOf: new Date() };
    }

    const usd = await this.provider.getUsdPrices(['TON', 'USDT']);
    const price = usd[base] / usd[quote];
    await this.cache.set(base, quote, price, 60);
    return { price, source: this.provider.name, asOf: new Date() };
  }

  listPairs() {
    return ['TON/USDT', 'USDT/TON'];
  }
}
