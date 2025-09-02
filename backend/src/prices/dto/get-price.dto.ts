import { IsIn } from 'class-validator';
import { SUPPORTED_SYMBOLS, type SymbolCode } from '../symbols';

export class GetPriceDto {
  @IsIn(SUPPORTED_SYMBOLS.slice())
  base!: SymbolCode;

  @IsIn(SUPPORTED_SYMBOLS.slice())
  quote!: SymbolCode;
}
