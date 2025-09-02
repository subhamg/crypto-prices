import { Test, TestingModule } from '@nestjs/testing';
import { PricesController } from './prices.controller';
import { PricesService } from './prices.service';
import { GetPriceDto } from './dto/get-price.dto';
import { AppConfigService } from 'src/config/app-config.service';

describe('PricesController', () => {
  let controller: PricesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PricesController],
      providers: [
        { provide: AppConfigService, useValue: { cacheTtlSeconds: 60 } },
        {
          provide: PricesService,
          useValue: {
            getPair: jest.fn(() =>
              Promise.resolve({
                price: 5,
                source: 'mock',
                asOf: new Date(),
              }),
            ),
            listPairs: jest.fn(() => ['TON/USDT', 'USDT/TON']),
          },
        },
      ],
    }).compile();

    controller = module.get<PricesController>(PricesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getPairs returns expected payload', () => {
    expect(controller.getPairs()).toEqual({ pairs: ['TON/USDT', 'USDT/TON'] });
  });

  it('getPrice returns expected payload shape', async () => {
    const dto: GetPriceDto = { base: 'TON', quote: 'USDT' } as GetPriceDto;
    const res = await controller.getPrice(dto);
    expect(res.pair).toBe('TON/USDT');
    expect(res.price).toBe(5);
    expect(res.source).toBe('mock');
    expect(typeof res.ttlSeconds).toBe('number');
    expect(res.asOf).toBeInstanceOf(Date);
  });
});
