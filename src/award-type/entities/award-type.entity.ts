import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm'
import { Base } from 'src/common/base/entities/base.entity'
import { ExchangeRate } from 'src/exchange-rate/entities/exchange-rate.entity'

@Entity('award_type')
export class AwardType extends Base {
  @ApiProperty()
  @Column({ unique: true, nullable: false })
  name: string

  @ApiProperty()
  @Column({ nullable: false, default: 0 })
  digit: number

  // ---------- start relation ----------//

  @OneToMany(() => ExchangeRate, (exchangeRate) => exchangeRate.type)
  @JoinColumn({ name: 'exchange_rate_id' })
  exchange: ExchangeRate

  // ---------- end relation ----------//
}
