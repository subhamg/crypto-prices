import { IsIn } from 'class-validator';

export class GetPriceDto {
  @IsIn(['TON', 'USDT'])
  base!: 'TON' | 'USDT';

  @IsIn(['TON', 'USDT'])
  quote!: 'TON' | 'USDT';
}
