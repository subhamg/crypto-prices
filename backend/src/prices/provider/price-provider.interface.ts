export interface PriceProvider {
  name: string;
  getUsdPrices(symbols: string[]): Promise<Record<string, number>>;
}
