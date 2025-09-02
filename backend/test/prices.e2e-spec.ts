import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { Server } from 'http';
import { AppModule } from '../src/app.module';
import { PriceCache } from '../src/prices/cache/price-cache.service';
import { CoinGeckoProvider } from '../src/prices/provider/coingecko.provider';
import { AppConfigService } from '../src/config/app-config.service';

describe('Prices (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PriceCache)
      .useValue({ get: jest.fn(), set: jest.fn() })
      .overrideProvider(AppConfigService)
      .useValue({ cacheTtlSeconds: 60 })
      .overrideProvider(CoinGeckoProvider)
      .useValue({
        name: 'mock',
        getUsdPrices: jest.fn(() => Promise.resolve({ TON: 5, USDT: 1 })),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
    httpServer = app.getHttpServer() as unknown as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /prices/pairs', async () => {
    await request(httpServer)
      .get('/prices/pairs')
      .expect(200)
      .expect({ pairs: ['TON/USDT', 'USDT/TON'] });
  });

  it('GET /prices/price returns computed price', async () => {
    const res = await request(httpServer)
      .get('/prices/price')
      .query({ base: 'TON', quote: 'USDT' })
      .expect(200);
    type PriceResponse = {
      pair: string;
      price: number;
      source: string;
      asOf: string;
      ttlSeconds: number;
    };
    const body = res.body as PriceResponse;
    expect(body.pair).toBe('TON/USDT');
    expect(body.price).toBe(5);
    expect(body.source).toBe('mock');
    expect(typeof body.ttlSeconds).toBe('number');
    expect(new Date(body.asOf)).toBeInstanceOf(Date);
  });

  it('GET /prices/price validates query params', async () => {
    await request(httpServer)
      .get('/prices/price')
      .query({ base: 'ETH', quote: 'USDT' })
      .expect(400);
  });
});
