import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { Base } from 'src/common/base/entities/base.entity'
import { ExchangeRate } from 'src/exchange-rate/entities/exchange-rate.entity'

@Entity('award')
@Index('IDX_AWARD_ID')
export class Award extends Base {
  @ApiProperty()
  @Column({ nullable: false })
  number: string

  @ApiProperty()
  @Column({ name: 'reward_date', unique: false, nullable: false })
  rewardDate: Date

  @ApiProperty()
  @Column({ name: 'start_date', unique: false, nullable: false })
  startDate: Date

  @ApiProperty()
  @Column({ name: 'end_date', unique: false, nullable: false })
  endDate: Date

  @ApiProperty()
  @Column({ nullable: false })
  no: number

  // ---------- start relation ----------//

  @ManyToOne(() => ExchangeRate, (exchangeRate) => exchangeRate.award)
  @JoinColumn({ name: 'exchange_rate_id' })
  exchange: ExchangeRate

  // ---------- end relation ----------//
}
