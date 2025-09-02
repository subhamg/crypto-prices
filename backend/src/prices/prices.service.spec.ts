import { Test, TestingModule } from '@nestjs/testing';
import { PricesService } from './prices.service';
import { PriceCache } from './cache/price-cache.service';
import { CoinGeckoProvider } from './provider/coingecko.provider';

describe('PricesService', () => {
  let service: PricesService;
  let cacheMock: jest.Mocked<PriceCache>;
  let providerMock: jest.Mocked<CoinGeckoProvider>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricesService,
        { provide: PriceCache, useValue: { get: jest.fn(), set: jest.fn() } },
        {
          provide: CoinGeckoProvider,
          useValue: { name: 'mock', getUsdPrices: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<PricesService>(PricesService);
    cacheMock = module.get(PriceCache);
    providerMock = module.get(CoinGeckoProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns 1 and derived when base equals quote', async () => {
    const result = await service.getPair('TON', 'TON');
    expect(result.price).toBe(1);
    expect(result.source).toBe('derived');
    expect(result.asOf).toBeInstanceOf(Date);
  });

  it('returns cache hit when present', async () => {
    const usdSpy = jest.spyOn(providerMock, 'getUsdPrices');
    cacheMock.get.mockResolvedValueOnce(2.5);
    const result = await service.getPair('TON', 'USDT');
    expect(result.price).toBe(2.5);
    expect(result.source).toBe('cache');
    expect(usdSpy).not.toHaveBeenCalled();
  });

  it('fetches provider, computes ratio, and caches on miss', async () => {
    const usdSpy = jest.spyOn(providerMock, 'getUsdPrices');
    const setSpy = jest.spyOn(cacheMock, 'set');
    cacheMock.get.mockResolvedValueOnce(undefined);
    providerMock.getUsdPrices.mockResolvedValueOnce({ TON: 5, USDT: 1 });
    const result = await service.getPair('TON', 'USDT');
    expect(result.price).toBe(5);
    expect(result.source).toBe('mock');
    expect(usdSpy).toHaveBeenCalledWith(['TON', 'USDT']);
    expect(setSpy).toHaveBeenCalledWith('TON', 'USDT', 5, 60);
  });
});
