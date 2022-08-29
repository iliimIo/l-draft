import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Base } from 'src/common/base/entities/base.entity'
import { ExchangeRate } from 'src/exchange-rate/entities/exchange-rate.entity'

@Entity('award')
export class Award extends Base {
  @ApiProperty()
  @Column({ nullable: false })
  number: string

  @ApiProperty()
  @Column({
    name: 'reward_date',
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    unique: false,
    nullable: false
  })
  rewardDate: Date

  @ApiProperty()
  @Column({
    name: 'start_date',
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    unique: false,
    nullable: false
  })
  startDate: Date

  @ApiProperty()
  @Column({
    name: 'end_date',
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    unique: false,
    nullable: false
  })
  endDate: Date

  @ApiProperty()
  @Column({ nullable: false })
  no: number

  @ApiProperty()
  @Column({ name: 'is_award', default: false, nullable: true })
  isAward: boolean

  // ---------- start relation ----------//

  @ManyToOne(() => ExchangeRate, (exchangeRate) => exchangeRate.award)
  @JoinColumn({ name: 'exchange_rate_id' })
  exchange: ExchangeRate

  // ---------- end relation ----------//
}
