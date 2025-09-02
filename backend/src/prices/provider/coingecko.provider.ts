import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { PriceProvider } from './price-provider.interface';
import { SimplePriceResponse } from 'src/types/price.type';
import { AppConfigService } from 'src/config/app-config.service';
import { COINGECKO_IDS, SymbolCode } from '../symbols';

@Injectable()
export class CoinGeckoProvider implements PriceProvider {
  private readonly logger = new Logger(CoinGeckoProvider.name);
  name = 'coingecko';

  constructor(private configService: AppConfigService) {}

  async getUsdPrices(symbols: string[]) {
    const base =
      this.configService.coingeckoBase ?? 'https://api.coingecko.com/api/v3';
    const ids = symbols
      .map((s) => {
        const id = COINGECKO_IDS[s as SymbolCode];
        if (!id) throw new Error(`Unsupported symbol: ${s}`);
        return id;
      })
      .join(',');

    try {
      const url = `${base}/simple/price`;
      const response = await axios.get<SimplePriceResponse>(url, {
        params: { ids, vs_currencies: 'usd' },
        timeout: 5000,
      });
      const out: Record<string, number> = {};
      for (const s of symbols) {
        const id = COINGECKO_IDS[s as SymbolCode];
        const price = response.data[id]?.usd;
        if (typeof price === 'number') out[s] = price;
      }
      return out;
    } catch (err) {
      this.logger.error(
        `Failed to fetch from CoinGecko: ${(err as Error).message}`,
      );
      throw err;
    }
  }
}
