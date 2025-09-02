import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { SymbolCode } from '../symbols';

@Entity({ name: 'price_snapshots' })
@Index(['base', 'quote', 'createdAt'])
export class PriceSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 16 })
  base!: SymbolCode;

  @Column({ type: 'varchar', length: 16 })
  quote!: SymbolCode;

  @Column({ type: 'float' })
  price!: number;

  @Column({ type: 'varchar', length: 32 })
  source!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
