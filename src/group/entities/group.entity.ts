import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, OneToMany, Index, ManyToOne } from 'typeorm'
import { Base } from 'src/common/base/entities/base.entity'
import { Categories } from 'src/categories/entities/categories.entity'
import { ExchangeRate } from 'src/exchange-rate/entities/exchange-rate.entity'

@Entity('group')
@Index('IDX_GROUP_ID')
export class Group extends Base {
  @ApiProperty()
  @Column({ unique: true, nullable: false })
  name: string

  @ApiProperty()
  @Column({ unique: true, nullable: true })
  code: string

  @ApiProperty()
  @Column({ nullable: true })
  logo: string

  // ---------- start relation ----------//
  @OneToMany(() => ExchangeRate, (exchangeRate) => exchangeRate.group)
  @JoinColumn({ name: 'exchange_rate_id' })
  exchange: ExchangeRate

  @Index('IDX_CATEGORIES_ID')
  @ManyToOne(() => Categories, (categories) => categories.group)
  @JoinColumn({ name: 'categories_id' })
  categories: Categories

  // ---------- end relation ----------//
}
