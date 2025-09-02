import { Controller, Get, Query } from '@nestjs/common';
import { PricesService } from './prices.service';
import { GetPriceDto } from './dto/get-price.dto';

@Controller('prices')
export class PricesController {
  constructor(private pricesService: PricesService) {}

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
      ttlSeconds: 60,
    };
  }

  @Get('pairs')
  getPairs() {
    return { pairs: this.pricesService.listPairs() };
  }
}
