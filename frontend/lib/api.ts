export type PriceResp = {
  pair: string;
  price: number;
  source: string;
  asOf: string;
  ttlSeconds: number;
};

export async function getPrice(
  base: "TON" | "USDT",
  quote: "TON" | "USDT"
): Promise<PriceResp> {
  const res = await fetch(`/api/price?base=${base}&quote=${quote}`);
  if (!res.ok) throw new Error("Failed to fetch price");
  return res.json();
}
