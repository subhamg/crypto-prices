import { Controller, Get, Query } from '@nestjs/common';
import { PricesService } from './prices.service';
import { GetPriceDto } from './dto/get-price.dto';
import { AppConfigService } from 'src/config/app-config.service';

@Controller('prices')
export class PricesController {
  constructor(
    private pricesService: PricesService,
    private config: AppConfigService,
  ) {}

  @Get('price')
  async getPrice(@Query() query: GetPriceDto) {
    const { price, source, asOf } = await this.pricesService.getPair(
      query.base,
      query.quote,
    );
    return {
      pair: `${query.base}/${query.quote}`,
      price,
      source,
      asOf,
      ttlSeconds: this.config.cacheTtlSeconds,
    };
  }

  @Get('pairs')
  getPairs() {
    return { pairs: this.pricesService.listPairs() };
  }
}
