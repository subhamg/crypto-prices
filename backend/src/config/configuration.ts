const configuration = () => ({
  PORT: parseInt(process.env.PORT ?? '3000', 10),
  REDIS_HOST: process.env.REDIS_HOST ?? 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  COINGECKO_BASE:
    process.env.COINGECKO_BASE ?? 'https://api.coingecko.com/api/v3',
});

export default configuration;
export type AppConfig = ReturnType<typeof configuration>;
