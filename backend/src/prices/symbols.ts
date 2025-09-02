export const SUPPORTED_SYMBOLS = ['TON', 'USDT'] as const;

export type SymbolCode = (typeof SUPPORTED_SYMBOLS)[number];

export const COINGECKO_IDS: Record<SymbolCode, string> = {
  TON: 'the-open-network',
  USDT: 'tether',
};

export function getAllPairs(): string[] {
  const pairs: string[] = [];
  for (const base of SUPPORTED_SYMBOLS) {
    for (const quote of SUPPORTED_SYMBOLS) {
      if (base === quote) continue;
      pairs.push(`${base}/${quote}`);
    }
  }
  return pairs;
}
