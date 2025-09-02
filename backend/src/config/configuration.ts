const configuration = () => ({
  PORT: parseInt(process.env.PORT ?? '3000', 10),
  REDIS_HOST: process.env.REDIS_HOST ?? 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  COINGECKO_BASE:
    process.env.COINGECKO_BASE ?? 'https://api.coingecko.com/api/v3',
  POSTGRES_HOST: process.env.POSTGRES_HOST ?? 'localhost',
  POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
  POSTGRES_USER: process.env.POSTGRES_USER ?? 'app',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ?? 'app',
  POSTGRES_DB: process.env.POSTGRES_DB ?? 'crypto',
  CACHE_TTL_SECONDS: parseInt(process.env.CACHE_TTL_SECONDS ?? '60', 10),
});

export default configuration;
export type AppConfig = ReturnType<typeof configuration>;
