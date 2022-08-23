import { AwardType } from './../../award-type/entities/award-type.entity'
import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { Base } from 'src/common/base/entities/base.entity'
import { Group } from 'src/group/entities/group.entity'
import { Award } from 'src/award/entities/award.entity'

@Entity('exchange_rate')
export class ExchangeRate extends Base {
  @ApiProperty()
  @Column({ nullable: false, default: 0 })
  exchange: number

  // ---------- start relation ----------//

  @ManyToOne(() => AwardType, (awardType) => awardType.exchange)
  @JoinColumn({ name: 'award_type_id' })
  type: AwardType

  @ManyToOne(() => Group, (group) => group.exchange)
  @JoinColumn({ name: 'group_id' })
  group: Group

  @OneToMany(() => Award, (award) => award.exchange)
  @JoinColumn({ name: 'award_id' })
  award: Award

  // ---------- end relation ----------//
}
